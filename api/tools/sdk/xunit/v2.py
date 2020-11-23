#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import socket
from dataclasses import dataclass
from datetime import datetime
from typing import List


class TestCase:

    def __init__(self, name: str, classname: str, file: str, ):



class TestSuite:
    """Contains the results of executing a testsuite"""

    def __init__(self, name: str, timestamp: datetime = None, hostname: str = None, time: float = None,
                 properties: dict = None, test_cases: List[TestCase] = None):
        """
        Create a TestSuite instance.
        :param name: TestSuite name.
        :param timestamp: Start date, defaults to present date.
        :param hostname: Host name where test suite was executed, defaults to current machine hostname.
        :param time: Total run time in seconds.
        :param properties: Generic properties, will be serialized into list of key value pairs.
        :param test_cases: list of test cases executed.
        """
        self.name = name
        self.timestamp = timestamp if timestamp is not None else datetime.now()
        self.hostname = hostname if hostname is not None else socket.gethostname()
        self.time = time
        self.properties = properties
        self.test_cases = test_cases


@dataclass
class OperatingSystem:
    """Operating system name"""
    name: str
    """Operting system version"""
    version: str


@dataclass
class Host:
    """Custom name"""
    name: str
    """Operating system"""
    os: OperatingSystem
    """CPU model"""
    cpu: str
    """Ram in Mega Bytes"""
    ram_mb: int


@dataclass
class TestEnvironment:
    """Host where test was run"""
    host: Host
    """Runtime metadata e.g. metrics or host details"""
    meta: dict


@dataclass
class Version:
    """Version name"""
    name: str
    """Changelist/hash id"""
    hash: str
    """Major version number"""
    major: int
    """Minor version number"""
    major: int
    """Revision version number"""
    rev: int
    """Other details"""
    meta: dict


class TestRun:
    """Contains a collection of test suites along with run info"""

    def __init__(self, name: str, test_env: TestEnvironment, app_ver: Version, test_ver: Version, timestamp: datetime,
                 time: float, suites: int, tests: int, failures: int, errors: int, skipped: int, distributed: bool,
                 meta: dict):
        pass


def to_xml_str(test_suite: List[TestSuite]) -> str:
    pass


def from_xml_str(data: str) -> List[TestSuite]:
    pass
