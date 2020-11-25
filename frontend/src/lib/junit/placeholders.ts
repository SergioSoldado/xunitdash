import {
  TestRunData,
  TestSuiteStatic,
  TestSuiteType,
  TestCaseStatic,
  TestCase,
} from './types'

export function getTestRunDataPlaceholder(): TestRunData {
  return {
    id: '1',
    name: 'Error',
    tests: 0,
    errors: 0,
    failures: 0,
    skipped: 0,
    meta: {},
    time: '',
    timestamp: '',
    detailUrl: '',
  }
}

export function getTestCaseStaticPlaceholder(): TestCaseStatic {
  return {
    id: '0',
    name: 'Error',
    description: '',
    classname: '',
    group: '',
    file: '',
    line: 0,
  }
}

export function getTestCasePlaceholder(): TestCase {
  return {
    id: '0',
    test_case_static_id: 0,
    test_suite_id: 0,
    time: 0,
    properties: {},
    system_out: '',
    system_err: '',
  }
}

export function getTestSuiteStaticPlaceholder(): TestSuiteStatic {
  return {
    id: '0',
    name: 'Error',
    description: '',
    group: '',
    file: '',
    log: '',
    version: '0.0.0',
    testCases: [],
  }
}

export function getTestSuitePlaceholder(): TestSuiteType {
  return {
    id: 0,
    test_suite_static_id: 0,
    test_run_id: 0,
    tests: 0,
    errors: 0,
    failures: 0,
    skipped: 0,
    time: 0,
    timestamp: '',
    hostname: '',
    url: '',
    properties: {},
    system_out: '',
    system_err: '',
    testSuiteStatic: getTestSuiteStaticPlaceholder(),
  }
}
