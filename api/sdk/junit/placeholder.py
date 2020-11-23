#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from dataclasses import dataclass
from typing import List

from lxml import etree


@dataclass
class SimpleField:
    tag: str
    type: str
    message: str
    text: str

    def serialize(self):
        node = etree.Element(self.tag, dict(type=self.type, message=self.message))
        node.text = self.text
        return node


@dataclass
class RerunType:
    tag: str
    message: str
    type: str
    text: str
    system_out: List[str]
    system_err: List[str]
    stack_trace: List[str]

    def serialize(self):
        root = etree.Element(self.tag, dict(message=self.message, type=self.type))
        root.text = self.text
        for val, name in ((self.system_err, 'system-err'), (self.system_out, 'system-err'), (self.stack_trace, 'stackTrace')):
            for e in val:
                node = etree.Element(name)
                node.text = e
                root.append(node)
        return root


@dataclass
class Pair:
    tag: str
    text: str

    def serialize(self):
        node = etree.Element(self.tag)
        node.text = self.text
        return node


@dataclass
class TestCase:
    """
    A test case following junit format.
    """
    system_err: List[Pair]
    system_out: List[Pair]
    properties: dict
    skipped: List[SimpleField]
    error: List[SimpleField]
    failure: List[SimpleField]
    rerun_failure: List[RerunType]
    rerun_error: List[RerunType]
    flaky_failure: List[RerunType]
    flaky_error: List[RerunType]
    attributes: dict

    def serialize(self) -> str:
        attributes = {k: str(v) for k, v in self.attributes.items()}
        if 'name' not in attributes or attributes['name'] is None:
            raise RuntimeError('"name" attribute is required.')

        root = etree.Element('testcase', attributes)

        p_node = etree.Element('properties')
        for k, v in self.properties.items():
            pp_node = etree.Element('property', {'name': k, 'value': v})
            p_node.append(pp_node)
        root.append(p_node)

        for e in (self.system_err, self.system_out, self.skipped, self.error, self.failure, self.rerun_failure, self.rerun_error, self.flaky_failure, self.flaky_error):
            if isinstance(e, list):
                for ee in e:
                    root.append(ee.serialize())
                continue
            root.append(e.serialize())

        return root


@dataclass
class TestSuite:
    """
    A suite of test cases following junit format.
    """

    system_err: List[Pair]
    system_out: List[Pair]
    properties: dict
    testcases: List[TestCase]
    attributes: dict

    def serialize(self):
        attributes = {k: str(v) for k, v in self.attributes.items()}
        if 'name' not in attributes or attributes['name'] is None:
            raise RuntimeError('"name" attribute is required.')

        root = etree.Element('testsuite', self.attributes)

        p_node = etree.Element('properties')
        for k, v in self.properties.items():
            pp_node = etree.Element('property', {'name': k, 'value': v})
            p_node.append(pp_node)
        root.append(p_node)

        for e in (self.system_err, self.system_out, self.testcases):
            if isinstance(e, list):
                for ee in e:
                    root.append(ee.serialize())
                continue
            root.append(e.serialize())

        return root


