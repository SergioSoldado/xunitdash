#!/usr/bin/env python3
# -*- coding: utf-8 -*-


from safrs import SAFRSBase, SAFRSAPI

from settings import db

SAFRSBase.db_commit = False


class Error(SAFRSBase, db.Model):
    __tablename__ = 'Error'

    id = db.Column(db.Integer, primary_key=True, server_default=db.FetchedValue())
    test_case_id = db.Column(db.ForeignKey('TestCase.id'))
    type = db.Column(db.String)
    message = db.Column(db.String)
    value = db.Column(db.String)

    test_case = db.relationship('TestCase', primaryjoin='Error.test_case_id == TestCase.id', backref='errors')


class Failure(SAFRSBase, db.Model):
    __tablename__ = 'Failure'

    id = db.Column(db.Integer, primary_key=True, server_default=db.FetchedValue())
    test_case_id = db.Column(db.ForeignKey('TestCase.id'))
    type = db.Column(db.String)
    message = db.Column(db.String)
    value = db.Column(db.String)

    test_case = db.relationship('TestCase', primaryjoin='Failure.test_case_id == TestCase.id', backref='failures')


class FlakyError(SAFRSBase, db.Model):
    __tablename__ = 'FlakyError'

    id = db.Column(db.Integer, primary_key=True, server_default=db.FetchedValue())
    test_case_id = db.Column(db.ForeignKey('TestCase.id'))
    type = db.Column(db.String, nullable=False)
    message = db.Column(db.String)
    value = db.Column(db.String)
    stack_trace = db.Column(db.String)
    system_out = db.Column(db.String)
    system_err = db.Column(db.String)

    test_case = db.relationship('TestCase', primaryjoin='FlakyError.test_case_id == TestCase.id',
                                backref='flaky_errors')


class FlakyFailure(SAFRSBase, db.Model):
    __tablename__ = 'FlakyFailure'

    id = db.Column(db.Integer, primary_key=True, server_default=db.FetchedValue())
    test_case_id = db.Column(db.ForeignKey('TestCase.id'))
    type = db.Column(db.String, nullable=False)
    message = db.Column(db.String)
    value = db.Column(db.String)
    stack_trace = db.Column(db.String)
    system_out = db.Column(db.String)
    system_err = db.Column(db.String)

    test_case = db.relationship('TestCase', primaryjoin='FlakyFailure.test_case_id == TestCase.id',
                                backref='flaky_failures')


class RerunError(SAFRSBase, db.Model):
    __tablename__ = 'RerunError'

    id = db.Column(db.Integer, primary_key=True, server_default=db.FetchedValue())
    test_case_id = db.Column(db.ForeignKey('TestCase.id'))
    type = db.Column(db.String, nullable=False)
    message = db.Column(db.String)
    value = db.Column(db.String)
    stack_trace = db.Column(db.String)
    system_out = db.Column(db.String)
    system_err = db.Column(db.String)

    test_case = db.relationship('TestCase', primaryjoin='RerunError.test_case_id == TestCase.id',
                                backref='rerun_errors')


class RerunFailure(SAFRSBase, db.Model):
    __tablename__ = 'RerunFailure'

    id = db.Column(db.Integer, primary_key=True, server_default=db.FetchedValue())
    test_case_id = db.Column(db.ForeignKey('TestCase.id'))
    type = db.Column(db.String, nullable=False)
    message = db.Column(db.String)
    value = db.Column(db.String)
    stack_trace = db.Column(db.String)
    system_out = db.Column(db.String)
    system_err = db.Column(db.String)

    test_case = db.relationship('TestCase', primaryjoin='RerunFailure.test_case_id == TestCase.id',
                                backref='rerun_failures')


class Skipped(SAFRSBase, db.Model):
    __tablename__ = 'Skipped'

    id = db.Column(db.Integer, primary_key=True, server_default=db.FetchedValue())
    test_case_id = db.Column(db.ForeignKey('TestCase.id'))
    type = db.Column(db.String)
    message = db.Column(db.String)
    value = db.Column(db.String)

    test_case = db.relationship('TestCase', primaryjoin='Skipped.test_case_id == TestCase.id', backref='skippeds')


class TestCase(SAFRSBase, db.Model):
    __tablename__ = 'TestCase'

    id = db.Column(db.Integer, primary_key=True, server_default=db.FetchedValue())
    test_case_static_id = db.Column(db.ForeignKey('TestCaseStatic.id'))
    test_suite_id = db.Column(db.ForeignKey('TestSuite.id'))
    time = db.Column(db.Numeric, nullable=False)
    properties = db.Column(db.JSON)
    system_out = db.Column(db.String)
    system_err = db.Column(db.String)

    test_case_static = db.relationship('TestCaseStatic',
                                       primaryjoin='TestCase.test_case_static_id == TestCaseStatic.id',
                                       backref='test_cases')
    test_suite = db.relationship('TestSuite', primaryjoin='TestCase.test_suite_id == TestSuite.id',
                                 backref='test_cases')


class TestCaseStatic(SAFRSBase, db.Model):
    __tablename__ = 'TestCaseStatic'

    id = db.Column(db.Integer, primary_key=True, server_default=db.FetchedValue())
    test_suite_static_id = db.Column(db.ForeignKey('TestSuiteStatic.id'))
    name = db.Column(db.String, nullable=False)
    classname = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    group = db.Column(db.String)
    file = db.Column(db.String)
    line = db.Column(db.Integer)

    test_suite_static = db.relationship('TestSuiteStatic',
                                        primaryjoin='TestCaseStatic.test_suite_static_id == TestSuiteStatic.id',
                                        backref='test_case_statics')


class TestRun(SAFRSBase, db.Model):
    __tablename__ = 'TestRun'

    id = db.Column(db.Integer, primary_key=True, server_default=db.FetchedValue())
    name = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    time = db.Column(db.Numeric, nullable=False)
    tests = db.Column(db.Integer, nullable=False)
    failures = db.Column(db.Integer, nullable=False)
    errors = db.Column(db.Integer, nullable=False)
    skipped = db.Column(db.Integer, nullable=False)
    meta = db.Column(db.JSON)


class TestSuite(SAFRSBase, db.Model):
    __tablename__ = 'TestSuite'

    id = db.Column(db.Integer, primary_key=True, server_default=db.FetchedValue())
    test_suite_static_id = db.Column(db.ForeignKey('TestSuiteStatic.id'))
    test_run_id = db.Column(db.ForeignKey('TestRun.id'))
    tests = db.Column(db.Integer, nullable=False)
    failures = db.Column(db.Integer, nullable=False)
    errors = db.Column(db.Integer, nullable=False)
    time = db.Column(db.Numeric, nullable=False)
    skipped = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    hostname = db.Column(db.String, nullable=False)
    url = db.Column(db.String)
    properties = db.Column(db.JSON)
    system_out = db.Column(db.String)
    system_err = db.Column(db.String)

    test_run = db.relationship('TestRun', primaryjoin='TestSuite.test_run_id == TestRun.id', backref='test_suites')
    test_suite_static = db.relationship('TestSuiteStatic',
                                        primaryjoin='TestSuite.test_suite_static_id == TestSuiteStatic.id',
                                        backref='test_suites')


class TestSuiteStatic(SAFRSBase, db.Model):
    __tablename__ = 'TestSuiteStatic'

    id = db.Column(db.Integer, primary_key=True, server_default=db.FetchedValue())
    name = db.Column(db.String, nullable=False, unique=True)
    description = db.Column(db.String)
    package = db.Column(db.String)
    group = db.Column(db.String)
    file = db.Column(db.String)
    log = db.Column(db.String)
    version = db.Column(db.String)


def create_api(app, host="localhost", port=3000, prefix=""):
    api = SAFRSAPI(app, host=host, port=port, prefix=prefix)
    api.expose_object(Error)
    api.expose_object(Failure)
    api.expose_object(FlakyError)
    api.expose_object(FlakyFailure)
    api.expose_object(RerunError)
    api.expose_object(RerunFailure)
    api.expose_object(Skipped)
    api.expose_object(TestCase)
    api.expose_object(TestCaseStatic)
    api.expose_object(TestSuite)
    api.expose_object(TestSuiteStatic)
    api.expose_object(TestRun)
    print("Starting SAFRS API: http://{}:{}/{}".format(host, port, prefix))
