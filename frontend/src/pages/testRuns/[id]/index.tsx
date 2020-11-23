import React, { ReactElement } from 'react'
import { A, H1, H3 } from '~/components/Typography'
import Page from '~/components/Page'
import { getSingleTestRun } from '~/lib/junit/testRuns'
import Grid from '~/components/Layouts/Grid'
import { TestRunData } from '~/lib/junit/types'
import { PlotData } from 'plotly.js'
import styled from 'styled-components'
import GridItem from '~/components/GridItem'
import reactJsonTheme from '~/components/Theme/reactJsonTheme'
import { secondsToHours } from '~/lib/dateUtils'
import dynamic from 'next/dynamic'
import { sortFunctionTestSuiteTime } from '~/lib/junit/utils'
import { Close } from '@material-ui/icons'
import { AppBar, Dialog, DialogContent, DialogTitle, Tab, Tabs } from '@material-ui/core'
import * as ld from 'lodash'
import PerfectScrollbar from 'react-perfect-scrollbar'
import CustomButton from '~/components/Button'
import { Column } from 'react-table'
import {
  TestCaseFlattened,
  getPlotConfig,
  getPlotLayout,
  TabPanel,
  a11yProps,
  // daysBack,
  getButtonTextArrayComponent,
  getColItemAutoWidth,
  NumberRangeColumnFilter,
  SliderColumnFilter,
  filterGreaterThan,
  getTestRunPlot,
} from '~/pageComponents/testRuns/misc'
import Link from 'next/link'

const Table = dynamic(() => import('~/components/ReactTable/Table'), {
  ssr: false,
})

const ReactJson = React.memo(
  dynamic(() => import('react-json-view'), {
    ssr: false,
  }),
)

const Plot = React.memo(
  dynamic(() => import('react-plotly.js'), {
    ssr: false,
  }),
)

const GraphSunburst = React.memo(
  dynamic(() => import('~/components/GraphSunburst'), {
    ssr: false,
  }),
)

const StyledPlot = styled(Plot)`
  width: 100%;
  height: 100%;
`

const TableContainer = styled.div`
  max-width: 200%;
  position: relative;
  overflow: scroll;
`

export async function getStaticProps({ params: { id } }) {
  if (!(typeof id == 'string' && !isNaN(parseInt(id)))) {
    return {
      notFound: true,
    }
  }
  const props = await getSingleTestRun(id)
  props.testSuites = props.testSuites.sort(sortFunctionTestSuiteTime)
  console.log(`getStaticProps testRuns/[id]/index.tsx id=${id}`)
  return { props }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

interface Props extends TestRunData {
}

interface State {
  tabIndex: number
  modalContent: React.ReactElement | string
  showModal: boolean
  tableData: Array<TestCaseFlattened>
}

export default class TestRun extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const tableData = []
    if (ld.isArray(props.testSuites)) {
      for (const testSuite of props.testSuites) {
        let ts = new Date(testSuite.timestamp)
        let time = 0
        for (const testCase of testSuite.testCases) {
          testCase['timestamp'] = new Date(ts.getTime() + time).toISOString()
          // @ts-ignore
          time += 1000 * parseFloat(testCase.time)
          tableData.push({ testSuite, testCase })
        }
      }
    }

    this.state = {
      tabIndex: 0,
      modalContent: '',
      showModal: false,
      tableData,
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
    } catch {
    }
    this.setState({
      showModal: !this.state.showModal,
      modalContent: element,
    })
  }

  render(): ReactElement {
    const { name, tests, errors, failures, skipped, testSuites, meta, time } = this.props
    const { tabIndex, tableData } = this.state

    if (!ld.isArray(testSuites)) {
      return <p>Error</p>
    }

    const metaHydrated = meta
    for (const k of Object.keys(metaHydrated)) {
      try {
        metaHydrated[k] = JSON.parse(metaHydrated[k].replace(/'/g, '"'))
      } catch {
      }
    }

    const plotData: Array<Partial<PlotData>> = [
      {
        values: [tests - (errors + failures + skipped), errors, failures, skipped],
        labels: ['Passes', 'Errors', 'Failures', 'Skipped'],
        type: 'pie',
        marker: {
          colors: ['green', 'red', 'black', 'purple'],
        },
      },
    ]

    const sunburstData = {
      name,
      size: time,
      children: testSuites.map((testSuite) => {
        return {
          name: testSuite.testSuiteStatic.name,
          size: testSuite.time,
          children: testSuite.testCases.map((testCase) => {
            let color = 'green'
            if (testCase.errors.length > 0) {
              color = 'red'
            } else if (testCase.failures.length > 0) {
              color = 'black'
            } else if (testCase.skips.length > 0) {
              color = 'purple'
            }
            return {
              name: testCase.testCaseStatic.name,
              size: testCase.time,
              color,
            }
          }),
        }
      }),
    }

    const sumAggregateProps = {
      aggregate: 'sum',
      Aggregated: ({ value }) => value,
    }

    const minAggregatorProps = {
      aggregate: 'min',
    }

    const experiment = {
      aggregate: 'max',
      Aggregated: (v) => {
        // debugger
        const testSuiteName = v.row.values['testSuite.testSuiteStatic.name']
        for (const testSuite of testSuites) {
          if (testSuite.testSuiteStatic.name === testSuiteName) {
            const { tests, errors, failures, skipped } = testSuite
            // @ts-ignore
            return `${((tests + skipped - (errors + failures)) / tests).toFixed(2) * 100} %`
          }
        }
        return 'N/A'
      },
    }

    const columns: Array<Column> = [
      getColItemAutoWidth(tableData, 'testSuite.testSuiteStatic.name', 'Suite', {
        Cell: ({ row }) => {
          const base = ld.get(row, 'original', ld.get(row, 'leafRows[0].original'))
          return (
            <Link href={`/testSuites/${base.testSuite.testSuiteStatic.id}`}>
              <A>{base.testSuite.testSuiteStatic.name}</A>
            </Link>
          )
        },
      }),
      getColItemAutoWidth(tableData, 'testCase.testCaseStatic.name', 'Case', {
        Cell: ({ row }) => {
          const base = ld.get(row, 'original', ld.get(row, 'leafRows[0].original'))
          return (
            <Link href={`/testSuites/${base.testSuite.testSuiteStatic.id}/${base.testCase.testCaseStatic.id}`}>
              <A>{base.testCase.testCaseStatic.name}</A>
            </Link>
          )
        },
      }),
      getColItemAutoWidth(tableData, 'testCase.testCaseStatic.classname', 'Class', experiment),
      getColItemAutoWidth(
        tableData,
        ({ testCase: { errors, failures, skips } }) => {
          if (errors.length > 0 || failures.length > 0) {
            return 'Fail'
          } else if (skips.length > 0) {
            return 'Skip'
          }
          return 'Pass'
        },
        'Status',
      ),
      // prettier-ignore
      getColItemAutoWidth(tableData, (d: TestCaseFlattened) => d.testCase.errors.length, 'Errors', {
        Cell: ({ row }) => getButtonTextArrayComponent(row, 'original.testCase.errors', this.handleToggleModal),
        Filter: SliderColumnFilter,
        filter: filterGreaterThan,
        ...sumAggregateProps,
      }),
      getColItemAutoWidth(tableData, (d: TestCaseFlattened) => d.testCase.failures.length, 'Failures', {
        Cell: ({ row }) => getButtonTextArrayComponent(row, 'original.testCase.failures', this.handleToggleModal),
        Filter: SliderColumnFilter,
        filter: filterGreaterThan,
        ...sumAggregateProps,
      }),
      getColItemAutoWidth(tableData, 'testCase.timestamp', 'Timestamp', minAggregatorProps),
      getColItemAutoWidth(tableData, (d: TestCaseFlattened) => Math.round(d.testCase.time), 'Duration (s)', {
        Filter: NumberRangeColumnFilter,
        filter: 'between',
        ...sumAggregateProps,
      }),
    ]

    const testSuiteTimePlotData: Array<Partial<PlotData>> = [
      {
        values: testSuites.map((item) => item.time),
        labels: testSuites.map((item) => item.testSuiteStatic.name),
        type: 'pie',
      },
    ]

    return (
      <Page withHeader>
        <H1>{name}</H1>

        <AppBar position="static">
          <Tabs value={tabIndex} onChange={this.handleTabIndexChanged} aria-label="simple tabs example">
            <Tab label="Results" {...a11yProps(0)} />
            <Tab label="Details" {...a11yProps(1)} />
            <Tab label="Graphs" {...a11yProps(2)} />
          </Tabs>
        </AppBar>

        <PerfectScrollbar style={{ width: '100%' }}>
          <TableContainer>
            <TabPanel value={tabIndex} index={0} style={{ maxWidth: '200%' }}>
              <Table name="Test Suites" columns={columns} data={tableData} />
            </TabPanel>
          </TableContainer>
        </PerfectScrollbar>

        <TabPanel value={tabIndex} index={1} style={{ width: '100%' }}>
          <ReactJson theme={reactJsonTheme} src={metaHydrated} />
        </TabPanel>

        <TabPanel value={tabIndex} index={2} style={{ width: '100%' }}>
          <Grid breakpoints={{ default: 2, 900: 1 }}>
            <GridItem>
              <H3>Status</H3>
              <StyledPlot data={plotData} layout={getPlotLayout(true, false)} config={getPlotConfig()} />
            </GridItem>
            <GridItem>
              <H3>Suite Durations</H3>
              <StyledPlot
                data={testSuiteTimePlotData}
                layout={getPlotLayout(true, false)}
                useResizeHandler
                config={getPlotConfig()}
              />
            </GridItem>
            <GridItem>
              <H3>Status vs Time</H3>
              <StyledPlot
                data={getTestRunPlot(tableData)}
                layout={getPlotLayout(true, false)}
                config={getPlotConfig()}
              />
            </GridItem>
            <GridItem>
              <H3>Status and Duration</H3>
              <GraphSunburst data={sunburstData} getToolTip={secondsToHours} />
            </GridItem>
          </Grid>

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
