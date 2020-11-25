import * as ld from 'lodash'

import { TestCaseStaticApi, TestSuiteStaticApi } from '~/api'
import { TestCase, TestCaseStatic, TestSuiteType, TestSuiteStatic } from './types'
import { AxiosResponse } from 'axios'
import { dateFormatYMD } from '~/lib/dateUtils'
import { getTestCasesOfTestSuite, TestcasesOfTestSuiteOptions } from '~/lib/junit/testRuns'

export const getDateFilter = (from: Date, to: Date): object => {
  return [
    {
      name: 'timestamp',
      op: 'gt',
      val: dateFormatYMD(from),
    },
    {
      name: 'timestamp',
      op: 'le',
      val: dateFormatYMD(to),
    },
  ]
}

export interface Response {
  total: number
  count: number
}

export const emptyRes = {
  total: -1,
  count: -1,
  data: [],
  included: []
}

export interface ApiBase {
  fields?: string
  include?: string
  filter?: object | Array<object>
  pageOffset?: number
  pageLimit?: number
  sort?: string
}

export function sortFunctionTestSuite(a: TestSuiteType, b: TestSuiteType) {
  const healthA = (a.tests + a.skipped - a.errors - a.failures) / a.tests
  const healthB = (b.tests + b.skipped - b.errors - b.failures) / b.tests
  return healthA < healthB ? -1 : 1
}

export function sortFunctionTestSuiteTime(a: TestSuiteType, b: TestSuiteType) {
  return a.time < b.time ? -1 : 1
}

export function sortFunctionTestCases(a: TestCase, b: TestCase) {
  const healthA = (a.failures.length > 0 ? 100 : 0) + (a.errors.length > 0 ? 10 : 0) + (a.skips.length > 0 ? 1 : 0)
  const healthB = (b.failures.length > 0 ? 100 : 0) + (b.errors.length > 0 ? 10 : 0) + (b.skips.length > 0 ? 1 : 0)
  return healthA < healthB ? -1 : 1
}

const testSuitesStaticTestCaseStatic = {}
export const getTestCaseStatic = async (id: string): Promise<TestCaseStatic> | null => {
  const key = JSON.stringify({
    id,
  })
  if (ld.has(testSuitesStaticTestCaseStatic, key)) {
    return testSuitesStaticTestCaseStatic[key]
  }
  const api = new TestCaseStaticApi()
  const res = await api.retrieveTestCaseStaticinstance1(id, 'application/vnd.api+json')
  try {
    if (!(ld.has(res, 'data') && ld.has(res['data'], 'data'))) {
      return null
    }
    const { id, attributes } = res['data']['data']
    const ret = {
      id,
      ...attributes,
    }
    testSuitesStaticTestCaseStatic[key] = ret
    return ret
  } catch (err) {
    console.log(err)
  }
  return null
}

export interface ApiRes {
  id: string
  attributes: object
  links: object
  relationships: object
}

export interface ApiResArray {
  data: Array<ApiRes>
}

function _getApiRes(obj: ApiRes) {
  const { id, attributes } = obj
  return { id, ...attributes }
}

export function getApiRes(res: AxiosResponse) {
  const { id, attributes } = res.data.data
  if (id === undefined || attributes === undefined) {
    console.log('getApiRes returned undefined:', res)
  }
  return { id, ...attributes }
}

export function getApiResArray(res: AxiosResponse): Array<any> {
  const data: ApiResArray = res.data
  return data.data.map((item) => _getApiRes(item))
}

export interface TestCasesStaticOptions extends ApiBase {}

export interface TestSuiteStaticTestCasesStatic extends Response {
  data: Array<TestCaseStatic>
}

const testSuiteStaticTestCasesStaticCache = {}

export const getTestSuiteStaticTestCasesStatic = async (
  id: string,
  options: TestCasesStaticOptions = {}
): Promise<TestSuiteStaticTestCasesStatic> => {
  const key = JSON.stringify({
    id,
    options,
  })
  if (ld.has(testSuiteStaticTestCasesStaticCache, key)) {
    return testSuiteStaticTestCasesStaticCache[key]
  }

  const tssApi = new TestSuiteStaticApi()
  const { fields, include, filter, pageOffset, pageLimit, sort = 'id' } = options

  const res = await tssApi.retrieveTestCaseStaticfromtestcasestatics0(
    id,
    include,
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
    filter ? JSON.stringify(filter) : undefined
  )

  try {
    const data = res['data']
    if (!Array.isArray(data['data'])) {
      return emptyRes
    }
    const ret = {
      // @ts-ignore
      total: data.meta.count,
      // @ts-ignore
      count: data.meta.limit,
      data: await Promise.all(
        data['data'].map(async ({ id, attributes }) => {
          return {
            id,
            ...attributes
          }
        }))
    }
    ret.data.sort((a, b) => (parseInt(a.id, 10) > parseInt(b.id, 10) ? 1 : -1))
    // @ts-ignore
    testSuiteStaticTestCasesStaticCache[key] = ret
    return ret
  } catch (err) {
    console.log(err)
  }

  return emptyRes
}

const singleTestSuiteStaticCache = {}
export const getSingleTestSuiteStatic = async (id: string): Promise<TestSuiteStatic> => {
  const key = id
  if (key in singleTestSuiteStaticCache) {
    return singleTestSuiteStaticCache[key]
  }
  const api = new TestSuiteStaticApi()

  try {
    const data = (await api.retrieveTestSuiteStaticinstance1(id, 'application/vnd.api+json')).data
    const ret = {
      id,
      ...data['data'].attributes,
      testCases: (await getTestSuiteStaticTestCasesStatic(id, {})).data,
    }
    singleTestSuiteStaticCache[key] = ret
    return ret
  } catch (err) {
    console.log(err)
  }
  return null
}

export interface TestCasesType extends Response {
  data: Array<TestCase>
}

export interface GetTestRunsOptions extends ApiBase {
  testTestCasesStaticOptions?: TestCasesStaticOptions
}

const multipleTestCasesOfCasesStatic = {}
export const getMultipleTestCasesOfCasesStatic = async (
  id: string,
  options: GetTestRunsOptions
): Promise<TestCasesType> => {
  const key = JSON.stringify({
    id,
    options,
  })
  if (ld.has(multipleTestCasesOfCasesStatic, key)) {
    return multipleTestCasesOfCasesStatic[key]
  }

  const { filter, include, fields, pageOffset, pageLimit, sort = 'id' } = options
  const api = new TestCaseStaticApi()

  const res = await api.retrieveTestCasefromtestcases0(
    id,
    include,
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

    const respData = data['data']
    const included = data['included']
    // console.log('included:', included)
    const ret = {
      // @ts-ignore
      total: data.meta.count,
      // @ts-ignore
      count: data.meta.limit,
      data: await Promise.all(
        respData.map(async ({ id, attributes, relationships }) => {
          const others = {}
          for (const [key, value] of Object.entries(relationships)) {
            const vData = value['data']
            if (vData === null) {
              continue
            }
            if (ld.isArray(vData)) {
              others[key] = []
              for (const d of vData) {
                // console.log(`Looking for ${d['type']} id ${d['id']}`)
                for (const e of included) {
                  // console.log(`Found array match ${key}:`, value)
                  if (e['type'] === d['type'] && e['id'] === d['id']) {
                    others[key].push({
                      id: e['id'],
                      ...e['attributes'],
                    })
                  }
                }
              }
            } else {
              // console.log(`Looking for ${vData['type']} id ${vData['id']} ->${typeof vData}`)
              for (const e of included) {
                if (e['type'] === vData['type'] && e['id'] === vData['id']) {
                  // console.log(`Found object match ${key}:`, value)
                  others[key] = {
                    id: e['id'],
                    ...e['attributes'],
                  }
                }
              }
            }
          }
          return {
            id,
            ...attributes,
            ...others,
          }
        })
      ),
    }
    multipleTestCasesOfCasesStatic[key] = ret
    return ret
  } catch (err) {
    console.log(err)
  }

  return emptyRes
}

export interface TestSuites extends Response {
  data: Array<TestSuiteType>
}

export interface TestSuitesOfSuiteStaticTypeOptions extends ApiBase {
  testCaseOptions?: TestcasesOfTestSuiteOptions
}

const multipleTestSuitesOfSuitesStatic = {}

export const getMultipleTestSuitesOfSuitesStatic = async (
  id: string,
  options: TestSuitesOfSuiteStaticTypeOptions
): Promise<TestSuites> => {
  const key = JSON.stringify({
    id,
    options,
  })
  if (ld.has(multipleTestSuitesOfSuitesStatic, key)) {
    return multipleTestSuitesOfSuitesStatic[key]
  }

  const { filter, include, fields, pageOffset, pageLimit, sort = 'timestamp', testCaseOptions = undefined } = options
  const api = new TestSuiteStaticApi()
  const res = await api.retrieveTestSuitefromtestsuites0(
    id,
    include,
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

  try {
    const data = res['data']
    if (!Array.isArray(data['data'])) {
      return emptyRes
    }
    const ret = {
      // @ts-ignore
      total: data.meta.count,
      // @ts-ignore
      count: data.meta.limit,
      data: await Promise.all(
        data['data'].map(async ({ id, attributes }) => {
          return {
            id,
            ...attributes,
            // testCases: await getTestCasesOfTestSuite(id, testCaseOptions),
            testCases: [],
          }
        })
      ),
    }
    if (testCaseOptions !== undefined) {
      for (let i = 0; i < ret.data.length; ++i) {
        const tsId = ret.data[i].id
        ret.data[i]['testCases'] = await getTestCasesOfTestSuite(tsId, testCaseOptions)
      }
    }
    multipleTestSuitesOfSuitesStatic[key] = ret
    return ret
  } catch (err) {
    console.log(err)
  }

  return emptyRes
}

export interface StaticTestSuits extends Response {
  data: Array<TestSuiteStatic>
}

const multipleTestSuitesStatic = {}

export const getMultipleTestSuitesStatic = async (options: GetTestRunsOptions): Promise<StaticTestSuits> => {
  const key = JSON.stringify({
    options,
  })
  if (ld.has(multipleTestSuitesStatic, key)) {
    return multipleTestSuitesStatic[key]
  }

  const { fields, include, filter, pageOffset, pageLimit, sort = 'id', testTestCasesStaticOptions } = options
  const api = new TestSuiteStaticApi()

  const res = await api.retrieveTestSuiteStaticinstance0(
    'application/json',
    include,
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
    const ret = {
      // @ts-ignore
      total: data.meta.count,
      // @ts-ignore
      count: data.meta.limit,
      data: await Promise.all(
        data['data'].map(async ({ id, attributes }) => {
          return {
            id,
            ...attributes,
            testCases: undefined,
          }
        })
      ),
    }

    if (testTestCasesStaticOptions !== undefined) {
      for (let i = 0; i < ret.data.length; ++i) {
        const e = ret.data[i]
        e.testCases = (await getTestSuiteStaticTestCasesStatic(e.id, testTestCasesStaticOptions)).data
      }
    }
    multipleTestSuitesStatic[key] = ret
    return ret
  } catch (err) {
    console.log(err)
  }

  return emptyRes
}
