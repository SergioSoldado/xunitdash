import React from 'react'
import Page from '~/components/Page'
import { TestSuiteStatic, TestSuiteType } from '~/lib/junit/types'
import { getDateFilter, getMultipleTestSuitesOfSuitesStatic, getMultipleTestSuitesStatic } from '~/lib/junit/utils'
import { Column } from 'react-table'
import { a11yProps, getColItemAutoWidth, getPlotConfig, getPlotLayout, TabPanel } from '~/pageComponents/testRuns/misc'
import PerfectScrollbar from 'react-perfect-scrollbar'
import styled from 'styled-components'
import reactJsonTheme from '~/components/Theme/reactJsonTheme'
import dynamic from 'next/dynamic'
import { AppBar, Tab, Tabs } from '@material-ui/core'
import { PlotData } from 'plotly.js'
import Link from 'next/link'
import { A, H1 } from '~/components/Typography'
import { shiftDate } from '~/lib/dateUtils'

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
  max-width: 200%;
  position: relative;
  overflow: scroll;
`

const StyledPlot = styled(Plot)`
  width: 100%;
  height: 100%;
`

interface Entry extends TestSuiteStatic {
  runs: Array<TestSuiteType>
  health: string
}

interface Props {
  items: Array<Entry>
}

export async function getStaticProps() {
  const items: Array<Entry> = []
  const pageLimit = 250
  do {
    const { data } = await getMultipleTestSuitesStatic({
      pageOffset: items.length,
      pageLimit,
      testTestCasesStaticOptions: {},
    })
    if (data.length <= 0) {
      break
    }

    const daysBack = 30
    const calendarEndDate = new Date()
    const calendarStartDate = shiftDate(calendarEndDate, -daysBack)
    const filter = getDateFilter(calendarStartDate, calendarEndDate)

    const tssData = data
    for (let i = 0; i < tssData.length; ++i) {
      const tss = tssData[i]

      const { total } = await getMultipleTestSuitesOfSuitesStatic(tss.id, {
        pageOffset: 0,
        pageLimit: 1,
        filter,
      })
      let tests = 0
      let errors = 0
      let fails = 0
      const runs = []
      do {
        const { data } = await getMultipleTestSuitesOfSuitesStatic(tss.id, {
          pageOffset: runs.length,
          pageLimit: 250,
        })
        if (data.length <= 0) {
          break
        }
        for (let j = 0; j < data.length; ++j) {
          const testSuiteRun = data[j]
          if (testSuiteRun.tests == tss.testCases.length) {
            tests += testSuiteRun.tests
            errors += testSuiteRun.errors
            fails += testSuiteRun.failures
          }
          runs.push(testSuiteRun)
        }
      } while (runs.length < total)

      runs.sort((a, b) => a.test_run_id - b.test_run_id)
      // if ( isCyclic(items)) {
      //   continue
      // }
      items.push({
        ...tss,
        health: ((100 * (tests - errors - fails)) / tests).toFixed(0),
        runs,
      })
    }
  } while (true)

  // console.log('items:', items)
  return { props: { items }, revalidate: 600 }
}

interface State {
  tabIndex: number
  modalContent: React.ReactElement | string
  showModal: boolean
}

export default class TestSuitesStatic extends React.Component<Props, State> {
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
    const { items } = this.props
    const { tabIndex } = this.state

    const columns: Array<Column> = [
      getColItemAutoWidth(items, 'name', 'Name', {
        Cell: ({ row }) => (
          <Link href={`/testSuites/${row.original.id}`}>
            <A>{row.original.name}</A>
          </Link>
        ),
      }),
      getColItemAutoWidth(items, 'testCases.length', 'Tests'),
      getColItemAutoWidth(items, 'health', 'Health Average (%)'),
    ]

    const plotDataTestSuiteErrors: Array<Partial<PlotData>> = []
    const plotDataTestSuiteErrorsBoxPlot: Array<Partial<PlotData>> = []
    const plotDataTestSuiteCases: Array<Partial<PlotData>> = []
    const plotDataTestSuiteCasesBoxPlot: Array<Partial<PlotData>> = []
    const plotDataTestSuiteTime: Array<Partial<PlotData>> = []
    const plotDataTestSuiteTimeBoxPlot: Array<Partial<PlotData>> = []
    for (let i = 0; i < items.length; ++i) {
      const ts = items[i]
      const x = ts.runs.map((e) => e.test_run_id)
      let y = ts.runs.map((e) => e.errors + e.failures)
      if (y.every((e) => e > 0)) {
        plotDataTestSuiteErrors.push({ x, y, mode: 'lines+markers', name: ts.name })
        plotDataTestSuiteErrorsBoxPlot.push({ y, type: 'box', name: ts.name })
      }

      y = ts.runs.map((e) => e.tests)
      plotDataTestSuiteCases.push({ x, y, mode: 'lines+markers', name: ts.name })
      plotDataTestSuiteCasesBoxPlot.push({ y, type: 'box', name: ts.name })

      y = ts.runs.map((e) => e.time)
      plotDataTestSuiteTime.push({ x, y, mode: 'lines+markers', name: ts.name })
      plotDataTestSuiteTimeBoxPlot.push({ y, type: 'box', name: ts.name })
    }

    return (
      <Page withHeader>
        <H1>All Test Suites</H1>
        <AppBar position="static">
          <Tabs value={tabIndex} onChange={this.handleTabIndexChanged} aria-label="simple tabs example">
            <Tab label="Suites" {...a11yProps(0)} />
            <Tab label="Graphs" {...a11yProps(1)} />
          </Tabs>
        </AppBar>

        <PerfectScrollbar style={{ width: '100%' }}>
          <TableContainer>
            <TabPanel value={tabIndex} index={0}>
              <Table name="Test Suites" columns={columns} data={items} />
            </TabPanel>
          </TableContainer>
        </PerfectScrollbar>

        <TabPanel value={tabIndex} index={1} style={{ width: '100%' }}>
          <StyledPlot
            data={plotDataTestSuiteErrors}
            layout={{
              ...getPlotLayout(true, false),
              title: 'Test Suite Errors (excludes suites with no errors)',
              xaxis: {
                title: 'Test Run',
              },
              yaxis: {
                title: 'Errors+Failures',
              },
            }}
            config={getPlotConfig()}
          />
          <StyledPlot
            data={plotDataTestSuiteErrorsBoxPlot}
            layout={{
              ...getPlotLayout(true, false),
              title: 'Test Suite Errors Box Plot',
              yaxis: {
                title: 'Errors+Failures',
              },
            }}
            config={getPlotConfig()}
          />

          <StyledPlot
            data={plotDataTestSuiteTime}
            layout={{
              ...getPlotLayout(true, false),
              title: 'Test Suite Execution Time',
              xaxis: {
                title: 'Test Run',
              },
              yaxis: {
                title: 'Duration (s)',
              },
            }}
            config={getPlotConfig()}
          />
          <StyledPlot
            data={plotDataTestSuiteTimeBoxPlot}
            layout={{
              ...getPlotLayout(true, false),
              title: 'Test Suite Execution Time Box Plot',
              yaxis: {
                title: 'Duration (s)',
              },
            }}
            config={getPlotConfig()}
          />

          <StyledPlot
            data={plotDataTestSuiteCases}
            layout={{
              ...getPlotLayout(true, false),
              title: 'Test Suite Test Cases Count',
              xaxis: {
                title: 'Test Run',
              },
              yaxis: {
                title: 'Total tests',
              },
            }}
            config={getPlotConfig()}
          />
          <StyledPlot
            data={plotDataTestSuiteCasesBoxPlot}
            layout={{
              ...getPlotLayout(true, false),
              title: 'Test Suite Test Cases Count Box Plot',
              yaxis: {
                title: 'Total tests',
              },
            }}
            config={getPlotConfig()}
          />

        </TabPanel>
      </Page>
    )
  }
}
