#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Test definitions for db.xunit
"""


import numpy as np
import pytest
from lorem_text import lorem

from junit.placeholder import TestSuite


def test_placeholder_test_suite():
    kwargs = {
        "name": lorem.words(1),
        "tests": str(np.random),
        "failures": lorem.words(1),
        "errors": lorem.words(1),
        "group": lorem.words(1),
        "time": lorem.words(1),
        "skipped": lorem.words(1),
        "timestamp": lorem.words(1),
        "hostname": lorem.words(1),
        "id": lorem.words(1),
        "package": lorem.words(3).replace(' ', '.'),
        "file": lorem.words(1),
        "log": lorem.words(1),
        "url": lorem.words(1),
        "version": lorem.words(1),
        'system_err': [],
        'system_out': [],
        'properties': [],
        'testcases': [],
    }
    for i in range(int(np.random.uniform(0, 10))):
        kwargs['system_err'].append(lorem.words(int(np.random.uniform(3, 10))))
    for i in range(int(np.random.uniform(0, 10))):
        kwargs['system_out'].append(lorem.words(int(np.random.uniform(3, 10))))
    for i in range(int(np.random.uniform(0, 10))):
        kwargs['properties'].append({lorem.words(1): lorem.words(int(np.random.uniform(1, 4)))})

    test_suite = TestSuite(**kwargs)
