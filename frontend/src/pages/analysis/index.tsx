import React, { ReactElement } from 'react'
import dynamic from 'next/dynamic'
import { getFailures } from '~/lib/junit/errorApi'
import { TestCase } from '~/lib/junit/types'
import reactJsonTheme from '~/components/Theme/reactJsonTheme'
import { H1 } from '~/components/Typography'
import { getMultipleTestCasesOfCasesStatic, getTestCaseStatic } from '~/lib/junit/utils'
import { getTestSuiteStatic } from '~/lib/junit/testRuns'
import {
  getButtonTextArrayComponent,
  getColItemAutoWidth,
  getKMostPopularKeys,
  getPlotConfig,
  getPlotLayout,
} from '~/pageComponents/testRuns/misc'
import { Column } from 'react-table'
import * as ld from 'lodash'
import Page from '~/components/Page'
import PerfectScrollbar from 'react-perfect-scrollbar'
import styled from 'styled-components'
import { PlotData } from 'plotly.js'
import Grid from '~/components/Layouts/Grid'
import GridItem from '~/components/GridItem'

const ReactTable = dynamic(() => import('~/components/ReactTable/Table'), {
  ssr: false,
})

const Plot = React.memo(
  dynamic(() => import('react-plotly.js'), {
    ssr: false,
  })
)

const ReactJson = React.memo(
  dynamic(() => import('react-json-view'), {
    ssr: false,
  })
)

const TableContainer = styled.div`
  max-width: 100%;
  position: relative;
  overflow: hidden;
`

const StyledPlot = styled(Plot)`
  width: 100%;
`

interface Props {
  testCaseRuns: Array<object>
  testSuiteStaticById: object
  testCaseStaticById: object
}

interface State {
  modalContent: React.ReactElement | string
  showModal: boolean
  dataFlattened: Array<object>
}

export async function getStaticProps() {
  const { total } = await getFailures({ fields: 'id', pageOffset: 0, pageLimit: 1 })
  const count = Math.min(total, 500)
  let pageOffset = Math.max(0, total - count)
  const tcsErrorCountById = {}
  do {
    const { data } = await getFailures({
      include: 'test_case',
      pageOffset,
      pageLimit: 250,
      sort: 'id',
    })
    if (data.length <= 0) {
      break
    }
    pageOffset += data.length
    for (const d of data) {
      const tcsId = d['test_case']['test_case_static_id']
      if (!(tcsId in tcsErrorCountById)) {
        tcsErrorCountById[tcsId] = 1
      } else {
        tcsErrorCountById[tcsId] += 1
      }
    }
  } while (pageOffset < total)

  // console.log('tcsErrorCountById:', tcsErrorCountById)

  let topTestCaseErrorByTcsId = []
  for (const k of Object.keys(tcsErrorCountById)) {
    topTestCaseErrorByTcsId.push({
      k,
      count: tcsErrorCountById[k],
    })
  }
  topTestCaseErrorByTcsId.sort(function (a, b) {
    return b.count - a.count
  })

  // Get top 20 in error count
  topTestCaseErrorByTcsId = topTestCaseErrorByTcsId
    .slice(0, Math.min(100, topTestCaseErrorByTcsId.length))
    .map((e) => e.k)

  // Get id info for top 20
  const testCaseStaticById = {}
  const testSuiteStaticById = {}
  const testCaseRuns = {}
  for (const tcsId of topTestCaseErrorByTcsId) {
    let runs: Array<TestCase> = []
    const { count } = await getMultipleTestCasesOfCasesStatic(tcsId, {
      fields: '',
      pageLimit: 1,
    })

    const numRuns = Math.min(count, 250)
    let pageOffset = count - 250
    if (pageOffset < 0) {
      pageOffset = 0
    }
    do {
      const { data } = await getMultipleTestCasesOfCasesStatic(tcsId, {
        pageOffset: pageOffset,
        include: 'test_suite,errors,failures,flaky_errors,flaky_failures,rerun_errors,rerun_failures,skippeds',
        pageLimit: 250,
      })
      pageOffset -= data.length
      if (data.length <= 0) {
        break
      }
      runs.push(...data)
      for (const d of data) {
        const tssId = d['test_suite']['test_suite_static_id'].toString()
        const tcsId = d['test_case_static_id'].toString()
        if (!(tssId in testSuiteStaticById)) {
          testSuiteStaticById[tssId] = await getTestSuiteStatic(tssId, {})
        }
        if (!(tcsId in testCaseStaticById)) {
          testCaseStaticById[tcsId] = await getTestCaseStatic(tcsId)
        }
      }
    } while (runs.length < numRuns)

    testCaseRuns[tcsId] = runs
  }

  return { props: { testCaseRuns, testCaseStaticById, testSuiteStaticById }, revalidate: 600 }
}

export default class Analysis extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const dataFlattened = []
    for (const e of Object.values(props.testCaseRuns)) {
      // @ts-ignore
      for (const ee of e) {
        dataFlattened.push({
          testSuiteName: props.testSuiteStaticById[ee.test_suite.test_suite_static_id].name,
          testCaseName: props.testCaseStaticById[ee.test_case_static_id].name,
          ...ee,
        })
      }
    }
    this.state = {
      modalContent: '',
      showModal: false,
      dataFlattened,
    }
  }

  handleToggleModal = (content) => {
    let element = content
    try {
      if (typeof content === 'object') {
        element = <ReactJson theme={reactJsonTheme} src={content} />
      } else {
        element = <ReactJson theme={reactJsonTheme} src={JSON.parse(content)} />
      }
    } catch {}
    this.setState({
      showModal: !this.state.showModal,
      modalContent: element,
    })
  }

  render(): ReactElement {
    const { testCaseRuns, testCaseStaticById, testSuiteStaticById } = this.props
    const { dataFlattened } = this.state

    const weigher = (k: string, v: object | string): number => {
      let weight = 1
      if (k.includes('env')) {
        weight = weight * 0.5
      }
      if (typeof v === 'object' || (typeof v === 'string' && v.length > 32)) {
        weight = weight * 0.2
      }
      if (typeof v === 'string' && v.length === 0) {
        weight = 0
      }
      return weight
    }

    const keys: Array<string> = getKMostPopularKeys(dataFlattened, 'properties', 10, weigher)

    const columns: Array<Column> = [
      getColItemAutoWidth(dataFlattened, 'testSuiteName', 'Test Suite'),
      getColItemAutoWidth(dataFlattened, 'testCaseName', 'Test Case'),
      getColItemAutoWidth(dataFlattened, 'test_suite.timestamp', 'Timestamp'),
      getColItemAutoWidth(dataFlattened, (e) => e.failures.length, 'Failures', {
        Cell: ({ row }) => getButtonTextArrayComponent(row, 'original.failures', this.handleToggleModal),
      }),
      getColItemAutoWidth(dataFlattened, (e) => e.errors.length, 'Errors', {
        Cell: ({ row }) => getButtonTextArrayComponent(row, 'original.errors', this.handleToggleModal),
      }),
      getColItemAutoWidth(dataFlattened, (e) => e.skippeds.length, 'Skips', {
        Cell: ({ row }) => getButtonTextArrayComponent(row, 'original.skippeds', this.handleToggleModal),
      }),
      getColItemAutoWidth(dataFlattened, (e) => parseFloat(e.time).toFixed(2), 'Time (s)'),
      ...keys.map((k) => {
        return getColItemAutoWidth(dataFlattened, `properties.${k}`, k, {
          Cell: ({ row }) => {
            const comp = ld.get(row, `original.properties.${k}`, null)
            if (typeof comp === 'string' && comp.length > 128) {
              return getButtonTextArrayComponent(row, `original.properties.${k}`, this.handleToggleModal, 'See')
            }
            return comp
          },
        })
      }),
    ]

    const plotDataCasesErrorOrFail: Array<Partial<PlotData>> = []
    const plotDataCasesErrorOrFailBoxPlot: Array<Partial<PlotData>> = []
    for (const run of Object.values(testCaseRuns)) {
      const name = `${testSuiteStaticById[run[0].test_suite_id].name}.${
        testCaseStaticById[run[0].test_case_static_id].name
      }`
      // @ts-ignore
      const x = run.map((e) => e.test_suite.test_run_id)
      // @ts-ignore
      const y = run.map((e) => {
        if (e.errors.length > 0 || e.failures.length > 0) {
          return -1
          // @ts-ignore
        } else if (e.skippeds.length > 0) {
          return 0
        }
        return 1
      })
      plotDataCasesErrorOrFail.push({ x, y, mode: 'lines+markers', name })
      plotDataCasesErrorOrFailBoxPlot.push({ y, boxmean: 'sd', type: 'box', name })
    }

    return (
      <Page withHeader>
        <H1>Analytics</H1>

        <Grid breakpoints={{ default: 1, 900: 1 }}>
          <GridItem>
            <StyledPlot
              data={plotDataCasesErrorOrFail}
              layout={{
                ...getPlotLayout(true, false),
                title: 'Test Case Status',
                xaxis: {
                  title: 'Test Run',
                },
                yaxis: {
                  title: 'Error(-1) Skip(+0) pass(+1)',
                },
              }}
              config={getPlotConfig()}
            />
          </GridItem>
          <GridItem>
            <StyledPlot
              data={plotDataCasesErrorOrFailBoxPlot}
              layout={{
                ...getPlotLayout(true, false),
                title: 'Test Case Status Box Plot',
                yaxis: {
                  title: 'Error(-1) Skip(+0) pass(+1)',
                },
              }}
              config={getPlotConfig()}
            />
          </GridItem>
        </Grid>

        <TableContainer>
          <PerfectScrollbar>
            <ReactTable name="Test Runs" columns={columns} data={dataFlattened} />
          </PerfectScrollbar>
        </TableContainer>
      </Page>
    )
  }
}
