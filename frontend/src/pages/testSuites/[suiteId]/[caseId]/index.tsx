import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Page from '~/components/Page'
import { Blockquote, H1 } from '~/components/Typography'
import { TestCase, TestCaseStatic, TestSuiteStatic } from '~/lib/junit/types'
import { getMultipleTestCasesOfCasesStatic, getTestCaseStatic } from '~/lib/junit/utils'
import { getTestSuiteStatic } from '~/lib/junit/testRuns'
import styled from 'styled-components'
import Link from 'next/link'
import reactJsonTheme from '~/components/Theme/reactJsonTheme'
import dynamic from 'next/dynamic'
import * as ld from 'lodash'
import { Column } from 'react-table'
import {
  getButtonTextArrayComponent,
  getColItemAutoWidth,
  getKMostPopularKeys,
  getPlotConfig,
  getPlotLayout,
} from '~/pageComponents/testRuns/misc'
import Table from '~/components/Tables/Simple'
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import CustomButton from '~/components/Button'
import { Close } from '@material-ui/icons'
import { PlotData } from 'plotly.js'
import Grid from '~/components/Layouts/Grid'
import GridItem from '~/components/GridItem'
import { isSame } from '~/lib/arrayUtils'

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

const Description = styled(Blockquote)`
  margin: 2rem 0;
`

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

export async function getStaticProps({ params: { suiteId, caseId } }) {
  if (
    !(typeof suiteId == 'string' && !isNaN(parseInt(suiteId))) ||
    !(typeof caseId == 'string' && !isNaN(parseInt(caseId)))
  ) {
    return {
      notFound: true,
    }
  }

  const testSuite = await getTestSuiteStatic(suiteId, {})
  const testCase = await getTestCaseStatic(caseId)

  let runs: Array<TestCase> = []
  const { count } = await getMultipleTestCasesOfCasesStatic(caseId, {
    fields: '',
    pageLimit: 1,
  })

  const numRuns = Math.min(count, 250)
  let pageOffset = count - 250
  if (pageOffset < 0) {
    pageOffset = 0
  }
  do {
    const { data } = await getMultipleTestCasesOfCasesStatic(caseId, {
      pageOffset: pageOffset,
      include: 'test_suite,errors,failures,flaky_errors,flaky_failures,rerun_errors,rerun_failures,skippeds',
      pageLimit: 250,
    })
    pageOffset -= data.length
    if (data.length <= 0) {
      break
    }
    runs.push(...data)
  } while (runs.length < numRuns)

  return {
    props: {
      testSuite,
      testCase,
      runs,
    },
    revalidate: 1800,
  }
}

interface Props {
  testSuite: TestSuiteStatic
  testCase: TestCaseStatic
  runs: Array<TestCase>
}

interface State {
  modalContent: string
  showModal: boolean
  filteredData: Array<TestCase>
}

export default class TestSuiteCase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      modalContent: '',
      showModal: false,
      filteredData: props.runs,
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

  onTableUpdate = (instance: any): any => {
    const { filteredData } = this.state
    const filteredDataNext = instance.rows.map((e) => e.original)
    if (isSame(filteredData.map((e) => parseInt(e.id)).sort(), filteredDataNext.map((e) => parseInt(e.id)).sort())) {
      return
    }
    this.setState({ filteredData: filteredDataNext })
  }

  render() {
    const { testSuite, testCase, runs } = this.props
    const { filteredData } = this.state

    if (!ld.has(testCase, 'id') || !ld.isArray(filteredData)) {
      return <p>Has errors</p>
    }

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
    const keys: Array<string> = getKMostPopularKeys(runs, 'properties', 10, weigher)
    console.log('keys:', keys)

    const columns: Array<Column> = [
      getColItemAutoWidth(runs, 'test_suite.timestamp', 'Timestamp'),
      getColItemAutoWidth(runs, (e) => e.failures.length, 'Failures', {
        Cell: ({ row }) => getButtonTextArrayComponent(row, 'original.failures', this.handleToggleModal),
      }),
      getColItemAutoWidth(runs, (e) => e.errors.length, 'Errors', {
        Cell: ({ row }) => getButtonTextArrayComponent(row, 'original.errors', this.handleToggleModal),
      }),
      getColItemAutoWidth(runs, (e) => e.skippeds.length, 'Skips', {
        Cell: ({ row }) => getButtonTextArrayComponent(row, 'original.skippeds', this.handleToggleModal),
      }),
      // getColItemAutoWidth(runs, (e) => e.id, 'Details', {
      //   Cell: ({ row }) => getButtonTextArrayComponent(row, 'original.properties', this.handleToggleModal, 'See'),
      // }),
      getColItemAutoWidth(runs, (e) => parseFloat(e.time).toFixed(2), 'Time (s)'),
      ...keys.map((k) => {
        return getColItemAutoWidth(runs, `properties.${k}`, k, {
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

    const { id, name, description, classname, group, file, line } = testCase

    const plotDataCasesErrorOrFail: Array<Partial<PlotData>> = []
    const plotDataCasesErrorOrFailBoxPlot: Array<Partial<PlotData>> = []
    const plotDataTime: Array<Partial<PlotData>> = []
    const plotDataTimeBoxPlot: Array<Partial<PlotData>> = []
    const x = filteredData.map((e) => e.test_suite.test_run_id)
    let y = filteredData.map((e) => {
      if (e.errors.length > 0 || e.failures.length > 0) {
        return -1
        // @ts-ignore
      } else if (e.skippeds.length > 0) {
        return 0
      }
      return 1
    })
    plotDataCasesErrorOrFail.push({ x, y, mode: 'lines+markers', name })
    plotDataCasesErrorOrFailBoxPlot.push({ y, boxmean:'sd', type: 'box', name })
    plotDataTime.push({ x, y: runs.map((e) => e.time), mode: 'lines+markers', name })
    plotDataTimeBoxPlot.push({ y: runs.map((e) => e.time), boxmean:'sd', type: 'box', name })

    const tableData = {
      id,
      name,
      classname,
      group,
      file,
      line,
      testSuite: <Link href={`/testSuites/${testSuite.id}`}>{testSuite.name}</Link>,
    }

    return (
      <Page withHeader>
        <H1>{name}</H1>
        <TableContainer>
          <PerfectScrollbar style={{ width: '100%' }}>
            <Table tableHead={Object.keys(tableData)} tableData={[tableData]} />
          </PerfectScrollbar>
        </TableContainer>

        <Description>{description}</Description>

        <Grid breakpoints={{ default: 2, 900: 1 }}>
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

          <GridItem>
            <StyledPlot
              data={plotDataTime}
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
          </GridItem>
          <GridItem>
            <StyledPlot
              data={plotDataTimeBoxPlot}
              layout={{
                ...getPlotLayout(true, false),
                title: 'Test Case Time Box Plot',
                yaxis: {
                  title: 'Time (s)',
                },
              }}
              config={getPlotConfig()}
            />
          </GridItem>
        </Grid>

        <TableContainer>
          <PerfectScrollbar>
            <ReactTable name="Test Runs" columns={columns} data={runs} onEdit={this.onTableUpdate} />
          </PerfectScrollbar>
        </TableContainer>

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
