from pathlib import Path

from lxml import etree

from backend.app import Host, OS, TestCase, TestCaseRun, TestEnvironment, TestRun, TestSuite, Version


_this_dir = Path(__file__).parent
_xml_schema_path= _this_dir / 'files' / 'xunit.xsd'


def xml_deserialize(xml_str: str) -> TestRun:
    root = etree.fromstring(xml_str)

    # validate xml
    with open('xunit.xsd') as _f:
        xmlschema_doc = etree.parse(_f)
        xmlschema = etree.XMLSchema(xmlschema_doc)
        if not xmlschema(root):
            raise RuntimeError(f'Invalid schema {xmlschema.error_log}')



    print('done')
