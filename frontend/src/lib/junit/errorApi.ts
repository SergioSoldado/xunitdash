import { ApiBase, emptyRes, Response } from '~/lib/junit/utils'
import { Error, TestCase } from '~/lib/junit/types'
import { FailureApi } from '~/api'
import * as ld from 'lodash'

export interface ErrorsType extends Response {
  data: Array<Error>
  included: Array<TestCase>
}

export const getFailures = async (options: ApiBase): Promise<ErrorsType> => {
  const { fields, include, filter, pageOffset, pageLimit, sort = 'id' } = options
  const api = new FailureApi()
  const res = await api.retrieveFailureinstance0(
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
    filter ? JSON.stringify(filter) : undefined
  )

  try {
    const data = res['data']
    if (!ld.isArray(data['data'])) {
      return emptyRes
    }

    const respData = data['data']
    const included = data['included']

    return {
      total: data['meta']['count'],
      count: data['meta']['limit'],
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
            ...others
          }
        })
      ),
      included: await Promise.all(
        data['included'].map(async ({ id, attributes }) => {
          return {
            id,
            ...attributes,
          }
        })
      ),
    }
  } catch (e) {
    console.log(e)
  }

  return emptyRes
}
