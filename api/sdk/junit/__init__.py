# -*- coding: utf-8 -*-

from pathlib import Path

from lxml import etree

_this_dir = Path(__file__).parent
_xml_schema_path = _this_dir / 'files' / 'junit-10.xsd'


def validate_junit_xsd(xml_data: etree.Element):
    """
    Validate xml against junit xsd.
    :raise RuntimeError if xml is invalid.
    :param xml_data: Parsed XML content.
    """
    with open(_xml_schema_path) as _f:
        xmlschema_doc = etree.parse(_f)
        xmlschema = etree.XMLSchema(xmlschema_doc)
        if not xmlschema(xml_data):
            raise RuntimeError(f'Invalid schema {xmlschema.error_log}')
