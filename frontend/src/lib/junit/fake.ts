import Dummy from 'dummyjs'
import * as ld from 'lodash'
import { getRandomInt } from '~/lib/mathUtils'

import {
  TestRunData,
  TestSuiteStatic,
  TestSuiteType,
  TestCaseStatic,
  TestCase,
} from './types'

export function MakeTestRunData(): TestRunData {
  return {
    id: '1',
    name: Dummy.text(3),
    tests: 100 + getRandomInt(20),
    errors: getRandomInt(20),
    failures: getRandomInt(20),
    skipped: getRandomInt(20),
    meta: {
      host: Dummy.text(1),
    },
    time: getRandomInt(7200).toString(),
    timestamp: new Date().toISOString(),
    detailUrl: Dummy.text(2),
  }
}

export function MakeTestCaseStatic(): TestCaseStatic {
  return {
    id: '0',
    name: Dummy.text(3),
    description: Dummy.text(5 + getRandomInt(200)),
    classname: Dummy.text(1 + getRandomInt(5)).replace(/ /g, '.'),
    group: Dummy.text(1 + getRandomInt(2)).replace(/ /g, '.'),
    file: Dummy.text(1),
    line: getRandomInt(1000),
  }
}

export function MakeTestCase(): TestCase {
  return {
    id: '1',
    test_case_static_id: getRandomInt(200),
    test_suite_id: getRandomInt(200),
    time: getRandomInt(1000),
    properties: {
      host: Dummy.text(2),
    },
    system_out: Dummy.text(getRandomInt(100)),
    system_err: Dummy.text(getRandomInt(100)),
  }
}

export function MakeTestSuiteStatic(): TestSuiteStatic {
  return {
    id: '1',
    name: Dummy.text(3),
    description: Dummy.text(5 + getRandomInt(200)),
    group: Dummy.text(1 + getRandomInt(2)).replace(/ /g, '.'),
    file: Dummy.text(1),
    log: Dummy.text(2),
    version: '1.0.0',
    testCases: ld.range(1 + getRandomInt(20)).map((_) => MakeTestCaseStatic()),
  }
}

export function MakeTestSuite(): TestSuiteType {
  return {
    id: 1,
    test_suite_static_id: 1,
    test_run_id: 1,
    tests: 100 + getRandomInt(20),
    errors: getRandomInt(20),
    failures: getRandomInt(20),
    skipped: getRandomInt(20),
    time: getRandomInt(7200),
    timestamp: new Date().toISOString(),
    hostname: Dummy.text(1),
    url: Dummy.text(3),
    properties: {
      host: Dummy.text(1),
    },
    system_out: Dummy.text(getRandomInt(100)),
    system_err: Dummy.text(getRandomInt(100)),
    testSuiteStatic: MakeTestSuiteStatic(),
  }
}
