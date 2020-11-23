#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Test definitions for db.xunit
"""

from pathlib import Path

import pytest

from db.xunit import xml_deserialize


_this_dir = Path(__file__).parent
_files_dir = _this_dir / 'files'


def test_xml_deserialize():
    """Test xml deserialization"""
    xml_file = _files_dir / 'xunit.xml'
    assert xml_file.is_file()
    with open(xml_file, 'rb') as _f:
        xml_str = _f.read()
    res = xml_deserialize(xml_str, 'UnittestRun', {
        'runtime': 'unittest'
    })

    print('done')
