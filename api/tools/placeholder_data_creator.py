#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import multiprocessing
import pickle
import random
from random import randint
from datetime import datetime, timedelta

import requests
import tqdm
from lorem_text import lorem
from lxml import etree

from sdk.junit import validate_junit_xsd
from sdk.junit.placeholder import TestSuite, TestCase, Pair, SimpleField


def generate_run_results(start_date: datetime, num_tests: int):
    _test_suites = []
    cur_time = start_date
    start_time = cur_time
    for suite_i in range(randint(4, 25)):
        cur_time += timedelta(seconds=randint(0, 4))  # overhead
        cur_time = cur_time.replace(microsecond=0)
        elapsed_suite = 0
        test_cases = []
        for case_i in range(int(num_tests / 10)):
            elapsed = randint(5, 60 * 10)
            elapsed_suite += elapsed
            cur_time += timedelta(seconds=elapsed)

            # Add some randomization
            choices = ['pass'] * randint(10, 70) + ['error'] * randint(0, 20) + [
                'skipped'] * randint(0, 5) + ['failure'] * randint(0, 5)
            while len(choices) < 100:
                choices.append(random.choice(('pass', 'error', 'skipped', 'failure')))
            status = random.choice(choices)

            properties = {}
            for i in range(randint(0, 10)):
                properties[f'key{i}'] = f'value{i}'

            test_case = TestCase(
                system_err=[Pair(tag='system-err', text=lorem.words(randint(1, 5))) for _ in
                            range(randint(0, 4))],
                system_out=[Pair(tag='system-out', text=lorem.words(randint(1, 5))) for _ in
                            range(randint(0, 4))],
                properties=properties,
                skipped=[] if status != 'skipped' else [
                    SimpleField(tag='skipped', type=lorem.words(1), message=lorem.words(randint(2, 15)),
                                text=lorem.words(randint(1, 5))) for _ in
                    range(randint(0, 4))],
                error=[] if status != 'error' else [
                    SimpleField(tag='error', type=lorem.words(1), message=lorem.words(randint(2, 15)),
                                text=lorem.words(randint(1, 5))) for _ in
                    range(randint(0, 4))],
                failure=[] if status != 'failure' else [
                    SimpleField(tag='failure', type=lorem.words(1), message=lorem.words(randint(2, 15)),
                                text=lorem.words(randint(1, 5))) for _ in
                    range(randint(0, 4))],
                rerun_failure=[],
                rerun_error=[],
                flaky_failure=[],
                flaky_error=[],
                attributes={
                    'name': f'test_case_{suite_i}_{case_i}',
                    'description': lorem.paragraph(),
                    'time': f'{elapsed:.3f}',
                    'classname': f'my.package.test_case_class_{suite_i}_{case_i}',
                    'group': f'Group {suite_i}_{case_i}',
                    'file': f'test_suites/test_suite{suite_i}.py',
                    'line': 1 + suite_i * 100 + case_i,
                }
            )
            test_cases.append(test_case)

        properties = {}
        for i in range(randint(0, 5)):
            properties[f'key{i}'] = f'value{i}'
        test_suite = TestSuite(
            system_err=[Pair(tag='system-err', text=lorem.words(randint(2, 10))) for _ in
                        range(randint(0, 4))],
            system_out=[Pair(tag='system-out', text=lorem.words(randint(2, 10))) for _ in
                        range(randint(0, 4))],
            properties=properties,
            testcases=test_cases,
            attributes={
                'name': f'test_suite_{suite_i}',
                'description': lorem.words(randint(2, 10)),
                'tests': str(len(test_cases)),
                'failures': str(len([e for e in test_cases if len(e.failure) > 0])),
                'errors': str(len([e for e in test_cases if len(e.error) > 0])),
                'group': f'Group {suite_i}',
                'time': f'{elapsed_suite:.3f}',
                'skipped': str(len([e for e in test_cases if len(e.skipped) > 0])),
                'timestamp': cur_time.isoformat(),
                'hostname': 'localhost',
                'id': str(suite_i + 1),
                'package': f'my.package{suite_i}',
                'file': f'test_suites/test_suite{suite_i}.py',
                'log': f'log_{suite_i}.log',
                'url': f'http://some_url/suite{suite_i}',
                'version': 'v1',
            }
        )
        _test_suites.append(test_suite)

    time = (cur_time - start_time).total_seconds()
    test_suites = etree.Element('testsuites', attrib={
        'name': 'test_run',
        'time': f'{time:.3f}',
        'tests': str(sum([len(e.testcases) for e in _test_suites])),
        'failures': str(sum([int(e.attributes['failures']) for e in _test_suites])),
        'errors': str(sum([int(e.attributes['errors']) for e in _test_suites])),
    })
    for ts in _test_suites:
        test_suites.append(ts.serialize())

    return test_suites


days_back = 60


def task(day):
    global days_back
    num_test_runs = randint(1, 3)
    for i in range(num_test_runs):
        date = datetime.now() - timedelta(days=days_back - day - 1) + timedelta(microseconds=1234)
        # test_suites = generate_run_results(date, num_tests=200 + 10 * randint(0, 50))
        test_suites = generate_run_results(date, num_tests=50)
        validate_junit_xsd(test_suites)
        res_str = etree.tostring(test_suites, pretty_print=True)
        headers = {'Content-Type': 'application/xml'}
        r = requests.post(
            f'http://localhost:5000/?name=Run{day}_{i}&runtime=unittest{day}_{i}&timestamp={date.isoformat()}&hostname=computer{randint(1, 10)}',
            data=res_str, headers=headers)


if __name__ == '__main__':
    res = []
    for d in range(days_back):
        task(d)
        res.append(0)
        list(tqdm.tqdm(res, total=days_back))
