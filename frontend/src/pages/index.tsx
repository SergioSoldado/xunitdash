import React, { ReactElement } from 'react'
import Page from '~/components/Page'
import Grid from '~/components/Layouts/Grid'
import styled from 'styled-components'
import GridItem from '~/components/GridItem'
import { H6 } from '~/components/Typography'
import HeatmapCalendar, { CalendarSample } from '~/components/HeatmapCalendar'
import { dateFormatYMD, secondsToHours, shiftDate } from '~/lib/dateUtils'
import { getTestRuns } from '~/lib/junit/testRuns'
import { TestRunData } from '~/lib/junit/types'
import SummaryPlot from '~/pageComponents/testRuns/SummaryPlot'
import { getDateFilter } from '~/lib/junit/utils'
import { Column } from 'react-table'
import dynamic from 'next/dynamic'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { getButtonTextArrayComponent, getColItemAutoWidth, getKMostPopularKeys } from '~/pageComponents/testRuns/misc'
import reactJsonTheme from '~/components/Theme/reactJsonTheme'
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import CustomButton from '~/components/Button'
import { Close } from '@material-ui/icons'
import Link from 'next/link'
import * as ld from 'lodash'
import { isSame } from '~/lib/arrayUtils'

const Table = dynamic(() => import('~/components/ReactTable/Table'), {
  ssr: false,
})

const ReactJson = dynamic(() => import('react-json-view'), {
  ssr: false,
})

const TableContainer = styled.div`
  max-width: 200%;
  position: relative;
  overflow: scroll;
`

const SummaryPlotMemoized = React.memo(SummaryPlot)
const HeatmapCalendarMemoized = React.memo(HeatmapCalendar)

const GraphicsItem = styled.div`
  color: inherit;
  background-color: inherit;
  & div,
  input,
  label {
    color: inherit;
    background-color: var(--bg-primary);
  }
`

const CalendarContainer = styled.div`
  width: 100%;
`

interface Props {
  data: Array<TestRunData>
  calendarData: Array<CalendarSample>
  totalRuns: number
  maxRunsPerDay: number
  calendarStartDate: Date
  calendarEndDate: Date
}

interface State {
  modalContent: React.ReactElement | string
  showModal: boolean
  filteredData: Array<TestRunData>
}

const daysBack = 5

export async function getStaticProps() {
  const calendarEndDate = new Date()
  const calendarStartDate = shiftDate(calendarEndDate, -daysBack)
  const { data, calendarData, totalRuns, maxRunsPerDay } = await getData(calendarStartDate, calendarEndDate)

  for (const obj of data) {
    for (const k of Object.keys(obj)) {
      try {
        obj[k] = JSON.parse(obj[k].replace(/'/g, '"'))
      } catch {}
    }
  }
  return {
    props: {
      data,
      calendarData,
      totalRuns,
      maxRunsPerDay,
      calendarStartDate: shiftDate(calendarEndDate, -365).toISOString(),
      calendarEndDate: calendarEndDate.toISOString(),
    },
    revalidate: 1,
  }
}

export default class TestRuns extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      modalContent: '',
      showModal: false,
      filteredData: props.data,
    }
  }

  onTableUpdate = (instance: any): any => {
    const { filteredData } = this.state
    const filteredDataNext = instance.rows.map((e) => e.original)
    if (isSame(filteredData.map((e) => parseInt(e.id)).sort(), filteredDataNext.map((e) => parseInt(e.id)).sort())) {
      return
    }
    this.setState({ filteredData: filteredDataNext })
  }

  handleToggleModal = (content) => {
    let element = content
    try {
      if (typeof content === 'object') {
        element = <ReactJson theme={reactJsonTheme} src={content} />
      } else {
        try {
          element = <ReactJson theme={reactJsonTheme} src={JSON.parse(content.replace(/'/g, '"'))} />
        } catch {}
        element = <ReactJson theme={reactJsonTheme} src={JSON.parse(content)} />
      }
    } catch {}
    this.setState({
      showModal: !this.state.showModal,
      modalContent: element,
    })
  }

  render(): ReactElement {
    const { totalRuns, maxRunsPerDay, calendarData, calendarStartDate, calendarEndDate, data } = this.props
    const { filteredData } = this.state

    const keys: Array<string> = getKMostPopularKeys(data, 'meta', 20)

    const columns: Array<Column> = [
      getColItemAutoWidth(data, (d: TestRunData) => d.id, 'Link', {
        Cell: ({ row }) => <Link href={`/testRuns/${row.original.id}`}>Open</Link>,
      }),
      getColItemAutoWidth(data, 'name', 'Name'),
      getColItemAutoWidth(data, 'tests', 'Tests'),
      getColItemAutoWidth(data, (e) => e.failures, 'Failures'),
      getColItemAutoWidth(data, (e) => e.errors, 'Errors'),
      getColItemAutoWidth(data, (e) => e.skipped, 'Skips'),
      getColItemAutoWidth(data, 'timestamp', 'Date'),
      getColItemAutoWidth(data, 'time', 'Duration'),
      getColItemAutoWidth(data, (d: TestRunData) => d.id, 'Details', {
        Cell: ({ row }) => getButtonTextArrayComponent(row, 'original.meta', this.handleToggleModal, 'See'),
      }),
      // ...keys.map((k) => getColItemAutoWidth(data, `meta.${k}`, k)),
      ...keys.map((k) => {
        return getColItemAutoWidth(data, `meta.${k}`, k, {
          Cell: ({ row }) => {
            const comp = ld.get(row, `original.meta.${k}`, null)
            if (typeof comp === 'string' && comp.length > 128) {
              return getButtonTextArrayComponent(row, `original.meta.${k}`, this.handleToggleModal, 'See')
            }
            return comp
          },
        })
      }),
    ]

    return (
      <Page withHeader>
        <Grid breakpoints={{ default: 2, 900: 1 }}>
          <GridItem>
            <GraphicsItem>
              <H6>
                {totalRuns} tests in the last {daysBack} days
              </H6>
              <CalendarContainer>
                <HeatmapCalendarMemoized
                  showWeekdays
                  startDate={calendarStartDate}
                  endDate={calendarEndDate}
                  maxDailySamples={maxRunsPerDay}
                  calendarSamples={calendarData}
                />
              </CalendarContainer>
            </GraphicsItem>
          </GridItem>

          <GridItem>
            <GraphicsItem>
              <SummaryPlotMemoized data={filteredData} />
            </GraphicsItem>
          </GridItem>
        </Grid>

        <PerfectScrollbar style={{ width: '100%' }}>
          <TableContainer>
            <Table name="Test Runs" columns={columns} data={data} onEdit={this.onTableUpdate} />
          </TableContainer>
        </PerfectScrollbar>

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

const getData = async (from: Date, to: Date) => {
  const getTestSuiteOptions = {
    fields: 'failures,errors,time',
  }

  const filter = getDateFilter(from, to)
  const { total } = await getTestRuns({
    fields: 'id',
    filter,
    pageOffset: 0,
    pageLimit: 1,
    sort: 'timestamp',
  })

  let entries: Array<TestRunData> = []
  const pageLimit = 250
  do {
    const { data } = await getTestRuns({
      pageOffset: entries.length,
      pageLimit,
      filter,
      getTestSuiteOptions,
    })
    if (data.length <= 0) {
      break
    }
    for (let i = 0; i < data.length; ++i) {
      const entry = data[i]
      entry.time = secondsToHours(parseFloat(entry.time))
      entry.timestamp = dateFormatYMD(entry.timestamp)
      entries.unshift(entry)
    }
  } while (entries.length < total)

  const dateMap: { [name: string]: number } = {}
  for (let i = 0; i < entries.length; ++i) {
    const key = dateFormatYMD(new Date(entries[i].timestamp))
    if (!(key in dateMap)) {
      dateMap[key] = 1
    } else {
      dateMap[key]++
    }
  }

  let totalRuns = 0
  let maxRunsPerDay = 0
  const calendarData = Object.keys(dateMap).map((date) => {
    maxRunsPerDay = Math.max(maxRunsPerDay, dateMap[date])
    totalRuns += dateMap[date]
    return {
      date: new Date(date).toISOString(),
      count: dateMap[date],
    }
  })

  return { data: entries, calendarData, totalRuns, maxRunsPerDay }
}
