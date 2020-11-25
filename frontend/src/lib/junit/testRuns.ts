import { TestRunData, TestSuiteType, TestSuiteStatic, TestCase, TestCaseStatic } from '~/lib/junit/types'
import { TestCaseApi, TestCaseStaticApi, TestRunApi, TestSuiteApi, TestSuiteStaticApi } from '~/api'
import * as ld from 'lodash'
import {
  Response,
  ApiBase,
  emptyRes,
  getTestSuiteStaticTestCasesStatic,
  getApiResArray,
  getApiRes,
} from '~/lib/junit/utils'

export interface TestSuiteStaticOptions extends ApiBase {
  testCaseStaticOptions?: ApiBase
}

const testSuiteStaticMap = {}

export const getTestSuiteStatic = async (id: string, options?: TestSuiteStaticOptions): Promise<TestSuiteStatic> => {
  const { fields = undefined, testCaseStaticOptions = undefined } = options

  const tssApi = new TestSuiteStaticApi()
  let data = null
  const key = JSON.stringify({
    id,
    options,
  })
  if (ld.has(testSuiteStaticMap, key)) {
    data = testSuiteStaticMap[key]
  } else {
    // console.log('getTestSuiteStatic id=', id)
    const res = await tssApi.retrieveTestSuiteStaticinstance1(id, 'application/json', undefined, fields)
    if (!(ld.has(res, 'data') && ld.has(res['data'], 'data'))) {
      return null
    }
    data = res['data']
    testSuiteStaticMap[key] = data
  }

  try {
    if (!ld.has(data, 'data')) {
      return null
    }
    return {
      id,
      ...data['data'].attributes,
      testCases: testCaseStaticOptions !== undefined ? await getTestSuiteStaticTestCasesStatic(id) : [],
    }
  } catch (err) {
    console.log(err)
  }
  return null
}

export interface GetTestRunSuiteCaseOptions extends ApiBase {}

export interface GetTestRunSuitesOptions extends ApiBase {
  testSuiteStaticOptions?: GetTestRunSuiteCaseOptions
}

export interface TestRunSuits extends Response {
  data: Array<TestSuiteType>
}

const testTestRunMap = {}

export const getTestRunSuites = async (id: string, options?: GetTestRunSuitesOptions): Promise<TestRunSuits> => {
  const api = new TestRunApi()
  const { fields, filter, pageOffset, pageLimit, sort = 'id', testSuiteStaticOptions = undefined } = options

  let _fields = fields

  if (testSuiteStaticOptions !== undefined) {
    if (_fields === undefined || _fields.length === 0) {
      _fields = 'test_suite_static_id'
    } else if (_fields === '*') {
      _fields = undefined
    } else if (_fields.length > 0 && !fields.includes('test_suite_static_id')) {
      _fields = `${_fields},test_suite_static_id`
    }
  }

  let res = null
  const key = JSON.stringify({
    id,
    options,
  })
  if (ld.has(testTestRunMap, key)) {
    return testTestRunMap[key]
  }
  res = await api.retrieveTestSuitefromtestsuites1(
    id,
    undefined,
    _fields,
    pageOffset,
    pageLimit,
    sort,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    filter ? JSON.stringify(filter) : undefined
  )

  if (!(ld.has(res, 'data') && ld.has(res['data'], 'data'))) {
    return emptyRes
  }

  const data = res['data']

  try {
    if (!Array.isArray(data['data'])) {
      return emptyRes
    }
    res = {
      // @ts-ignore
      total: data.meta.count,
      // @ts-ignore
      count: data.meta.limit,
      data: await Promise.all(
        data['data'].map(async ({ id, attributes }) => {
          return {
            id,
            testSuiteStatic: null,
            ...attributes,
          }
        })
      ),
    }
    if (testSuiteStaticOptions !== undefined) {
      for (let i = 0; i < res.data.length; ++i) {
        const e = res.data[i]
        e.testSuiteStatic = await getTestSuiteStatic(e['test_suite_static_id'], testSuiteStaticOptions)
      }
    }
    testTestRunMap[key] = res
    return res
  } catch (err) {
    console.log(err)
  }

  return emptyRes
}

export interface TestRuns extends Response {
  data: Array<TestRunData>
}

export interface GetTestRunsOptions extends ApiBase {
  getTestSuiteOptions?: GetTestRunSuitesOptions
}

export interface TestCases extends Response {
  data: Array<TestCase>
}

export interface TestcasesOfTestSuiteOptions {
  getErrors?: boolean
  getFailures?: boolean
  getSkips?: boolean
}

const testCaseStaticCache = {}
export const getTestCaseStatic = async (
  id: string
): Promise<TestCaseStatic> => {
  if (ld.has(testCaseStaticCache, id)) {
    return testCaseStaticCache[id]
  }
  const tcsApi = new TestCaseStaticApi()
  let res = getApiRes(await tcsApi.retrieveTestCaseStaticinstance1(id, 'application/json'))
  testCaseStaticCache[id] = res
  return res
}

export const getTestCasesOfTestSuite = async (
  id: string,
  options: TestcasesOfTestSuiteOptions
): Promise<Array<TestCase>> => {
  const tsApi = new TestSuiteApi()
  const tcApi = new TestCaseApi()

  const { getErrors = false, getFailures = false, getSkips = false } = options

  try {
    const testCasesRes = getApiResArray(await tsApi.retrieveTestCasefromtestcases1(id))
    if (!ld.isArray(testCasesRes)) {
      return []
    }
    let testCases = []
    for (let i = 0; i < testCasesRes.length; ++i) {
      const testCase = testCasesRes[i]
      const tcId = testCase.id
      const tcsId = testCase.test_case_static_id
      const item = {
        id: testCase.id,
        testCaseStatic: await getTestCaseStatic(tcsId),
        ...testCase,
        rerun_failures: [],
        rerun_errors: [],
        flaky_failures: [],
        flaky_errors: [],
        skips: getSkips ? getApiResArray(await tcApi.retrieveSkippedfromskippeds0(tcId)) : [],
        errors: getErrors ? getApiResArray(await tcApi.retrieveErrorfromerrors0(tcId)) : [],
        failures: getFailures ? getApiResArray(await tcApi.retrieveFailurefromfailures0(tcId)) : [],
        // rerun_failures: getApiResArray(await tcApi.retrieveRerunFailurefromrerunfailures0(tcId)),
        // rerun_errors: getApiResArray(await tcApi.retrieveRerunErrorfromrerunerrors0(tcId)),
        // flaky_failures: getApiResArray(await tcApi.retrieveFlakyFailurefromflakyfailures0(tcId)),
        // flaky_errors: getApiResArray(await tcApi.retrieveFlakyErrorfromflakyerrors0(tcId)),
      }
      if (item.testCaseStatic === null || item.testCaseStatic === undefined) {
        console.log('item.testCaseStatic is undefined!!!!!!!!!!!!!!', testCase.test_case_static_id)
      }
      testCases.push(item)
    }
    testCases = testCases.sort(function (a, b) {
      const healthA = (a.tests + a.skipped - a.errors - a.failures) / a.tests
      const healthB = (b.tests + b.skipped - b.errors - b.failures) / b.tests
      return healthA < healthB ? -1 : 1
    })
    return testCases
  } catch (err) {
    console.log(err)
  }
  return null
}

const singleTestTestRunMap = {}

export const getSingleTestRun = async (id: string): Promise<TestRunData> => {
  const api = new TestRunApi()

  if (ld.has(singleTestTestRunMap, id)) {
    return singleTestTestRunMap[id]
  }

  try {
    const data = (await api.retrieveTestRuninstance1(id, 'application/json')).data
    const res = {
      id,
      ...data['data'].attributes,
      testSuites: (await getTestRunSuites(id, { fields: '*', testSuiteStaticOptions: {} })).data,
    }

    for (let i = 0; i < res.testSuites.length; ++i) {
      const ts = res.testSuites[i]
      console.log(`res.testSuites[${i}].id=`, res.testSuites[i].id)
      const options = {
        getErrors: ts.errors > 0,
        getFailures: ts.failures > 0,
        getSkips: ts.skipped > 0,
      }
      res.testSuites[i].testCases = await getTestCasesOfTestSuite(res.testSuites[i].id, options)
    }
    singleTestTestRunMap[id] = res
    return res
  } catch (err) {
    console.log('Error is:', err)
  }
  return null
}

const testRunsMap = {}

export const getTestRuns = async (options: GetTestRunsOptions): Promise<TestRuns> => {
  const api = new TestRunApi()
  const { fields, filter, pageOffset, pageLimit, sort = 'timestamp', getTestSuiteOptions } = options

  const key = JSON.stringify({
    options,
  })
  if (ld.has(testRunsMap, key)) {
    return testRunsMap[key]
  }

  const res = await api.retrieveTestRuninstance0(
    'application/json',
    undefined,
    fields,
    pageOffset,
    pageLimit,
    sort,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    filter ? JSON.stringify(filter) : undefined
  )

  if (!(ld.has(res, 'data') && ld.has(res['data'], 'data'))) {
    return emptyRes
  }

  const data = res['data']

  try {
    if (!Array.isArray(data['data'])) {
      return emptyRes
    }
    const res = {
      // @ts-ignore
      total: data.meta.count,
      // @ts-ignore
      count: data.meta.limit,
      data: await Promise.all(
        data['data'].map(async ({ id, attributes }) => {
          return {
            id,
            ...attributes,
            testSuites: null,
          }
        })
      ),
    }

    if (getTestSuiteOptions !== undefined) {
      for (let i = 0; i < res.data.length; ++i) {
        const e = res.data[i]
        e.testSuites = (await getTestRunSuites(e.id, getTestSuiteOptions)).data
      }
    }

    testRunsMap[key] = res
    return res
  } catch (err) {
    console.log(err)
  }
  return emptyRes
}
