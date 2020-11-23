# -*- coding: utf-8 -*-

import logging
from datetime import datetime

from lxml import etree

from database.models import Error, Failure, FlakyError, FlakyFailure, RerunError, \
    RerunFailure, Skipped, TestCase, TestCaseStatic, TestSuite, TestSuiteStatic, TestRun
from sdk.junit import validate_junit_xsd

_l = logging.getLogger(__file__)


def _type_fixes(val: dict):
    if 'time' in val.keys() and isinstance(val['time'], str):
        val['time'] = float(val['time'])
    for k in ('tests', 'failures', 'errors', 'skipped', 'line'):
        if k in val.keys() and isinstance(val[k], str):
            val[k] = int(val[k])
    if 'timestamp' in val.keys() and isinstance(val['timestamp'], str):
        try:
            val['timestamp'] = datetime.strptime(val['timestamp'], '%Y-%m-%dT%H:%M:%S.%f')
        except ValueError:
            val['timestamp'] = datetime.strptime(val['timestamp'], '%Y-%m-%dT%H:%M:%S')
    return val


def _add_props_and_output(src: etree.Element, dst: dict):
    dst['properties'] = {p.attrib['name']: p.attrib['value']
                         for ps in src.findall('properties')
                         for p in ps.findall('property')}
    dst['system_out'] = '\n'.join([e.text for e in src.findall('system-out')])
    dst['system_err'] = '\n'.join([e.text for e in src.findall('system-err')])
    return dst


def timestamp_from_string(val: str):
    if isinstance(val, datetime):
        return val
    else:
        for pat in ('%Y-%m-%dT%H:%M:%S.%f', '%Y-%m-%dT%H:%M:%S', '%Y-%m-%d %H:%M:%S.%f', '%Y-%m-%d %H:%M:%S'):
            try:
                return datetime.strptime(val, pat)
            except ValueError:
                pass
    return RuntimeError('Unknown timestamp format')


def xml_deserialize(db, app, xml_data: bytes, meta: dict = None, create_new_entries: bool = True) -> TestRun:
    root = etree.fromstring(xml_data)
    validate_junit_xsd(root)

    with app.app_context():
        try:
            timestamp = timestamp_from_string(meta['timestamp'])
        except RuntimeError:
            timestamp = datetime.now()
            del meta['timestamp']
        test_run = TestRun(name=meta['name'], time=0.0, tests=0, failures=0, errors=0, skipped=0, timestamp=timestamp,
                           meta=meta)

        total_tests = 0
        total_time = 0.0
        total_failures = 0
        total_errors = 0
        total_skipped = 0
        test_suites_nodes = root.findall('testsuite')
        for ts_node in test_suites_nodes:
            ts_attrib = ts_node.attrib
            ts_name = ts_attrib['name']
            tss = db.session.query(TestSuiteStatic).filter_by(name=ts_name).first()
            if tss is None and create_new_entries:
                _l.warning(f'Will insert TestSuiteStatic name="{ts_name}"')
                tss_kwargs = {k: ts_attrib.get(k, None) for k in
                              ('name', 'description', 'package', 'group', 'file', 'log', 'version')}
                tss = TestSuiteStatic(**tss_kwargs)
                db.session.add(tss)
                db.session.commit()

            ts_kwargs = _add_props_and_output(ts_node, _type_fixes({
                **{k: ts_attrib.get(k, None) for k in
                   ('tests', 'failures', 'errors', 'time', 'skipped', 'timestamp', 'hostname', 'url')},
                'test_suite_static': tss,
                'test_run': test_run,
            }))
            total_time += ts_kwargs['time']
            total_failures += ts_kwargs['failures']
            total_errors += ts_kwargs['errors']
            total_skipped += ts_kwargs['skipped']
            total_tests += ts_kwargs['tests']
            test_suite = TestSuite(**ts_kwargs)
            db.session.add(test_suite)
            db.session.commit()

            for tc_node in ts_node.findall('testcase'):
                tc_attrib = tc_node.attrib
                tc_name = tc_attrib['name']
                tcs = db.session.query(TestCaseStatic).filter_by(test_suite_static=tss, name=tc_name).first()
                if tcs is None and create_new_entries:
                    tcs_kwargs = _type_fixes(
                        {k: tc_attrib.get(k, None) for k in
                         ('name', 'classname', 'description', 'group', 'file', 'line')})
                    tcs_kwargs['test_suite_static'] = tss
                    tcs = TestCaseStatic(**tcs_kwargs)
                    _l.warning(f'Will insert TestSuiteStatic name="{tc_name}"')
                    db.session.add(tcs)
                    db.session.commit()
                tc_kwargs = _add_props_and_output(tc_node, _type_fixes({
                    **{k: tc_attrib.get(k, None) for k in ('time',)},
                    'test_case_static': tcs,
                    'test_suite': test_suite,
                }))

                test_case = TestCase(**tc_kwargs)
                db.session.add(test_case)
                db.session.commit()

                for name, klass in (('error', Error), ('failure', Failure), ('skipped', Skipped)):
                    for node in tc_node.findall(name):
                        kwargs = {'test_case': test_case,
                                  # 'type': node.attrib.get('type', None),
                                  'message': node.attrib.get('message', None), 'value': node.text}
                        instance = klass(**kwargs)
                        db.session.add(instance)
                        db.session.commit()

                for name, klass in (('rerunFailure', RerunFailure), ('rerunError', RerunError),
                                    ('flakyFailure', FlakyFailure), ('flakyError', FlakyError)):
                    for node in tc_node.findall(name):
                        kwargs = {
                            'test_case': test_case,
                            'type': node.attrib.get('type', None),
                            'message': node.attrib.get('message', None),
                            'value': node.text,
                            'system_out': '\n'.join([e.text for e in node.findall('system-out')]),
                            'system_err': '\n'.join([e.text for e in node.findall('system-err')]),
                            'stack_trace': '\n'.join([e.text for e in node.findall('stackTrace')])
                        }
                        instance = klass(**kwargs)
                        db.session.add(instance)
                        db.session.commit()

        test_run.tests = total_tests
        test_run.errors = total_errors
        test_run.failures = total_failures
        test_run.skipped = total_skipped
        test_run.time = total_time
        db.session.commit()
        return test_run
