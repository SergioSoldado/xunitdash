import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { A, H1 } from '~/components/Typography'
import { TestSuiteStatic, TestSuiteType } from '~/lib/junit/types'
import Page from '~/components/Page'
import styled from 'styled-components'
import {
  getDateFilter,
  getMultipleTestSuitesOfSuitesStatic,
  getMultipleTestSuitesStatic,
  getSingleTestSuiteStatic,
} from '~/lib/junit/utils'
import { shiftDate } from '~/lib/dateUtils'
import { Column } from 'react-table'
import { AppBar, Dialog, DialogContent, DialogTitle, Tab, Tabs } from '@material-ui/core'
import {
  a11yProps,
  getButtonTextComponent,
  getColItemAutoWidth,
  getPlotConfig,
  getPlotLayout,
  TabPanel,
} from '~/pageComponents/testRuns/misc'
import reactJsonTheme from '~/components/Theme/reactJsonTheme'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import CustomButton from '~/components/Button'
import { Close } from '@material-ui/icons'
import { PlotData } from 'plotly.js'
import * as ld from 'lodash'

const Table = dynamic(() => import('~/components/ReactTable/Table'), {
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
  max-width: 90%;
  position: relative;
  overflow: hidden;
`

const StyledPlot = styled(Plot)`
  width: 100%;
  height: 100%;
`

export async function getStaticPaths() {
  let paths: Array<object> = []
  // Get a single page and depend on lazy ssr.
  const pageLimit = 1
  do {
    const { data } = await getMultipleTestSuitesStatic({
      pageOffset: paths.length,
      fields: '',
      pageLimit,
    })
    if (data.length <= 0) {
      break
    }
    for (const d of data) {
      paths.push({
        params: { suiteId: d.id },
      })
    }
  } while (true)

  return {
    paths,
    fallback: true,
  }
}

const daysBack = 30

export async function getStaticProps({ params: { suiteId } }) {
  if (!(typeof suiteId == 'string' && !isNaN(parseInt(suiteId)))) {
    console.log('Error in [suiteID]/index.tsx')
    return {
      notFound: true,
    }
  }
  const testSuite = await getSingleTestSuiteStatic(suiteId)
  const endDate = new Date()
  const startDate = shiftDate(endDate, -daysBack)
  const filter = getDateFilter(startDate, endDate)

  const testCaseErrorCountById = {}
  for (let i = 0; i < testSuite.testCases.length; ++i) {
    const testCase = testSuite.testCases[i]
    // console.log('testCase.id:', testCase.id)
    testCaseErrorCountById[testCase.id] = {
      tests: 0,
      errors: 0,
      failures: 0,
      skips: 0,
    }
  }

  let runs: Array<TestSuiteType> = []
  let tests = 0
  let errors = 0
  let fails = 0
  do {
    const { data } = await getMultipleTestSuitesOfSuitesStatic(suiteId, {
      pageOffset: runs.length,
      // fields: 'test_run_id,tests,failures,errors,skipped,timestamp,hostname,properties',
      pageLimit: 250,
      filter,
      testCaseOptions: {
        getErrors: true,
        getFailures: true,
        getSkips: false,
      },
    })
    if (data.length <= 0) {
      break
    }
    for (const testSuiteRun of data) {
      try {
        tests += testSuiteRun.tests
        errors += testSuiteRun.errors
        fails += testSuiteRun.failures
        // testSuiteRun.testCases.sort((a, b) => (a.test_case_static_id < b.test_case_static_id ? 1 : -1))
        for (const testCaseRun of testSuiteRun.testCases) {
          const tcsId = testCaseRun.test_case_static_id
          testCaseErrorCountById[tcsId]['tests'] += 1
          testCaseErrorCountById[tcsId]['errors'] += testCaseRun.errors.length > 0 ? 1 : 0
          testCaseErrorCountById[tcsId]['failures'] += testCaseRun.failures.length > 0 ? 1 : 0
          testCaseErrorCountById[tcsId]['skips'] += testCaseRun.skips.length > 0 ? 1 : 0
        }
      } catch (e) {
        console.log(`Error typeof testSuite.testCases is "${typeof testSuite.testCases}":`, e)
      }
    }
    runs.push(...data)
  } while (true)

  const health = ((100 * (tests - errors - fails)) / tests).toFixed(0)
  for (let i = 0; i < testSuite.testCases.length; ++i) {
    const testCase = testSuite.testCases[i]
    const { tests, errors, failures } = testCaseErrorCountById[testCase.id]
    testCase['health'] = ((100 * (tests - errors - failures)) / tests).toFixed(0)
  }
  runs.sort((a, b) => (a.test_run_id < b.test_run_id ? 1 : -1))
  return {
    props: { testSuite, runs, health, testCaseErrorCountById },
    revalidate: 3600,
  }
}

interface Props {
  testSuite: TestSuiteStatic
  runs: Array<TestSuiteType>
  health: string
}

interface State {
  tabIndex: number
  modalContent: React.ReactElement | string
  showModal: boolean
}

export default class TestSuite extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      tabIndex: 0,
      modalContent: '',
      showModal: false,
    }
  }

  handleTabIndexChanged = (_, tabIndex) => {
    console.log(tabIndex)
    this.setState({ tabIndex })
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

  render() {
    const { runs, testSuite, health } = this.props
    const { tabIndex } = this.state

    if (
      testSuite === undefined ||
      !ld.has(testSuite, 'id') ||
      !ld.has(testSuite, 'name') ||
      !ld.has(testSuite, 'testCases') ||
      !ld.isArray(testSuite.testCases)
    ) {
      return <p>Error testSuite no id</p>
    }
    const { id, name, testCases } = testSuite

    const columns: Array<Column> = [
      getColItemAutoWidth(testCases, 'name', 'Name', {
        Cell: ({ row }) => (
          <Link href={`/testSuites/${id}/${row.original.id}`}>
            <A>{row.original.name}</A>
          </Link>
        ),
      }),
      getColItemAutoWidth(testCases, 'health', 'Health Average (%)'),
      getColItemAutoWidth(testCases, 'classname', 'Classname'),
      getColItemAutoWidth(testCases, 'group', 'Group'),
      getColItemAutoWidth(testCases, 'file', 'file'),
      getColItemAutoWidth(testCases, 'description', 'Description', {
        Cell: ({ row }) => getButtonTextComponent(row, 'original.description', this.handleToggleModal, 'See'),
      }),
    ]

    const plotDataByTestCaseId = {}
    for (let i = 0; i < testCases.length; ++i) {
      plotDataByTestCaseId[testCases[i].id] = {
        x: [],
        xStatus: [],
        status: [],
        time: [],
      }
    }

    const caseNameById = {}

    for (let i = 0; i < runs.length; ++i) {
      const { test_run_id, testCases } = runs[i]
      for (let j = 0; j < testCases.length; ++j) {
        const {
          test_case_static_id,
          errors,
          skips,
          time,
          testCaseStatic: { name },
        } = testCases[j]
        caseNameById[test_case_static_id] = name
        const id = test_case_static_id
        plotDataByTestCaseId[id].x.push(test_run_id)
        plotDataByTestCaseId[id].xStatus.push(test_run_id + j * 0.002)
        if (errors && errors.length > 0) {
          plotDataByTestCaseId[id].status.push(-1)
        } else if (skips && skips.length > 0) {
          plotDataByTestCaseId[id].status.push(0)
        } else {
          plotDataByTestCaseId[id].status.push(1)
        }
        plotDataByTestCaseId[id].time.push(time)
      }
    }

    const plotDataTestSuiteErrorsTraces: Array<Partial<PlotData>> = []
    const plotDataTestSuiteErrorsTracesBoxPlot: Array<Partial<PlotData>> = []
    const plotDataTestSuiteTime: Array<Partial<PlotData>> = []
    const plotDataTestSuiteTimeBoxPlot: Array<Partial<PlotData>> = []
    Object.keys(plotDataByTestCaseId).map((caseId) => {
      const { x, xStatus, status, time } = plotDataByTestCaseId[caseId]
      plotDataTestSuiteErrorsTraces.push({ x: xStatus, y: status, mode: 'lines+markers', name: caseNameById[caseId] })
      plotDataTestSuiteErrorsTracesBoxPlot.push({ y: status, type: 'box', name: caseNameById[caseId] })
      plotDataTestSuiteTime.push({ x, y: time, mode: 'lines+markers', name: caseNameById[caseId] })
      plotDataTestSuiteTimeBoxPlot.push({ y: time, type: 'box', name: caseNameById[caseId] })
    })

    return (
      <Page withHeader>
        <H1>{name}</H1>

        <AppBar position="static">
          <Tabs value={tabIndex} onChange={this.handleTabIndexChanged} aria-label="simple tabs example">
            <Tab label="Cases" {...a11yProps(0)} />
            <Tab label="Details" {...a11yProps(1)} />
            <Tab label="Graphs" {...a11yProps(2)} />
          </Tabs>
        </AppBar>

        <PerfectScrollbar style={{ width: '100%' }}>
          <TableContainer>
            <TabPanel value={tabIndex} index={0}>
              <Table name="Test Cases" columns={columns} data={testCases} />
            </TabPanel>
          </TableContainer>
        </PerfectScrollbar>

        <TabPanel value={tabIndex} index={1} style={{ width: '100%' }}>
          <ReactJson
            theme={reactJsonTheme}
            src={{
              ...testSuite,
              health,
            }}
          />
        </TabPanel>

        <TabPanel value={tabIndex} index={2} style={{ width: '100%' }}>
          <StyledPlot
            data={plotDataTestSuiteErrorsTraces}
            layout={{
              ...getPlotLayout(true, false),
              title: 'Test Case Status',
              xaxis: {
                title: 'Test Run Id',
              },
              yaxis: {
                title: 'Error(-1) Skip(+0) pass(+1)',
              },
            }}
            config={getPlotConfig()}
          />
          <StyledPlot
            data={plotDataTestSuiteErrorsTracesBoxPlot}
            layout={{
              ...getPlotLayout(true, false),
              title: 'Test Case Status Box Plot',
              yaxis: {
                title: 'Error(-1) Skip(+0) pass(+1)',
              },
            }}
            config={getPlotConfig()}
          />

          <StyledPlot
            data={plotDataTestSuiteTime}
            layout={{
              ...getPlotLayout(true, false),
              title: 'Test Case Time',
              xaxis: {
                title: 'Test Run Id',
              },
              yaxis: {
                title: 'Time (s)',
              },
            }}
            config={getPlotConfig()}
          />
          <StyledPlot
            data={plotDataTestSuiteTimeBoxPlot}
            layout={{
              ...getPlotLayout(true, false),
              title: 'Test Case Time Box Plot',
              yaxis: {
                title: 'Time (s)',
              },
            }}
            config={getPlotConfig()}
          />
        </TabPanel>

        <Dialog
          open={this.state.showModal}
          onClose={() => this.handleToggleModal('')}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          fullWidth
          maxWidth={false}
        >
          <DialogTitle id="modal-title" disableTypography>
            <CustomButton simple key="close" aria-label="Close" onClick={() => this.handleToggleModal('')}>
              <Close />
            </CustomButton>
          </DialogTitle>
          <DialogContent id="modal-description">{this.state.modalContent}</DialogContent>
        </Dialog>
      </Page>
    )
  }
}
