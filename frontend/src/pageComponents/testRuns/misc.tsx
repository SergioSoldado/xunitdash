import { TestCase, TestSuiteType } from '~/lib/junit/types'
import * as ld from 'lodash'
import { FilterProps, FilterValue, IdType, Row } from 'react-table'

import CustomButton from '~/components/Button'
import React from 'react'
import { Config, Layout, PlotData } from 'plotly.js'
import { Box, InputLabel, TextField } from '@material-ui/core'
import { Clear } from '@material-ui/icons'

export function getKMostPopularKeys(
  objs: Array<object>,
  path: string,
  k: number,
  weigher: (k: string, v: any) => number = null
) {
  const binned = {}
  try {
    for (let i = 0; i < objs.length; ++i) {
      let obj = objs[i]
      if (path && path.length > 0) {
        obj = ld.get(objs[i], path, {})
      }

      for (const k of Object.keys(obj)) {
        if (typeof obj[k] !== 'string' && typeof obj[k] !== 'number') {
          continue
        }
        let weight = 1
        if (weigher) {
          weight = weigher(k, obj[k])
        }
        if (!ld.has(binned, k)) {
          binned[k] = weight
        } else {
          binned[k] += weight
        }
      }
    }
    let binnedArr = []
    for (const k of Object.keys(binned)) {
      binnedArr.push({
        k,
        count: binned[k],
      })
    }
    binnedArr.sort(function(a, b) {
      return b.count - a.count
    })

    return binnedArr.slice(0, Math.min(k, binnedArr.length)).map((e) => e.k)
  } catch (e) {
    console.log(e)
    return []
  }
}

export function getPlotLayout(
  showlegend: boolean = true,
  noMargin: boolean = false,
  title: string = ''
): Partial<Layout> {
  let m = noMargin ? 0 : 40
  return {
    plot_bgcolor: '#00000000',
    paper_bgcolor: '#00000000',
    font: {
      color: '#999999FF',
    },
    autosize: true,
    showlegend: showlegend,
    margin: {
      l: m,
      r: m,
      b: m,
      t: m,
      pad: 0,
    },
    title,
  }
}

export function getButtonTextComponent(root, key, cb, tag: string = undefined) {
  if (!ld.has(root, key)) {
    return null
  }
  const content = ld.get(root, key)
  return (
    <CustomButton style={{ height: '1rem', margin: 0 }} disabled={content.length === 0} onClick={() => cb(content)}>
      {tag}
    </CustomButton>
  )
}

export function getButtonTextArrayComponent(root, key, cb, tag: string = undefined) {
  if (!ld.has(root, key)) {
    return null
  }
  const content = ld.get(root, key)
  return (
    <CustomButton style={{ height: '1rem', margin: 0 }} disabled={content.length === 0} onClick={() => cb(content)}>
      {tag ? tag : content.length}
    </CustomButton>
  )
}

export function getColItemAutoWidth(
  data,
  accessor: string | ((Object) => string | number),
  headerText,
  props: object = undefined
) {
  let cellLength = headerText.length
  try {
    cellLength = Math.max(
      ...data.map((row) => {
        let value: string | number
        if (typeof accessor === 'string') {
          value = ld.get(row, accessor)
        } else {
          value = accessor(row)
        }
        if (typeof value === 'number') return value.toString().length
        if (typeof value === 'string' && value.length > 64) {
          return headerText.length
        }
        return (value || '').length
      }),
      headerText.length
    )
  } catch (e) {
    console.log(e)
  }

  const magicSpacing = 20
  const width = cellLength * magicSpacing
  let ret = {
    Header: headerText,
    accessor,
    width,
  }
  if (props !== undefined) {
    ret = {
      ...ret,
      ...props,
    }
  }

  return ret
}

export const useActiveElementTable = () => {
  const [active, setActive] = React.useState(document.activeElement)

  const handleFocusIn = () => {
    setActive(document.activeElement)
  }

  React.useEffect(() => {
    document.addEventListener('focusin', handleFocusIn)
    return () => {
      document.removeEventListener('focusin', handleFocusIn)
    }
  }, [])

  return active
}

export const getMinMax = (rows: Row<TestCaseFlattened>[], id: IdType<TestCaseFlattened>) => {
  let min = rows.length ? rows[0].values[id] : 0
  let max = rows.length ? rows[0].values[id] : 0
  rows.forEach((row) => {
    min = Math.min(row.values[id], min)
    max = Math.max(row.values[id], max)
  })
  return [min, max]
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
export function NumberRangeColumnFilter({
  // @ts-ignore
  column: { filterValue = [], render, preFilteredRows, setFilter, id },
}: FilterProps<TestCaseFlattened>) {
  const [min, max] = React.useMemo(() => getMinMax(preFilteredRows, id), [id, preFilteredRows])
  const focusedElement = useActiveElementTable()
  const hasFocus = focusedElement && (focusedElement.id === `${id}_1` || focusedElement.id === `${id}_2`)
  return (
    <>
      <InputLabel htmlFor={id} shrink focused={!!hasFocus}>
        {render('Header')}
      </InputLabel>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 5 }}>
        <TextField
          id={`${id}_1`}
          value={filterValue[0] || ''}
          type="number"
          onChange={(e) => {
            const val = e.target.value
            setFilter((old: any[] = []) => [val ? parseInt(val, 10) : undefined, old[1]])
          }}
          placeholder={`Min (${min})`}
          style={{
            width: '70px',
            marginRight: '0.5rem',
          }}
        />
        to
        <TextField
          id={`${id}_2`}
          value={filterValue[1] || ''}
          type="number"
          onChange={(e) => {
            const val = e.target.value
            setFilter((old: any[] = []) => [old[0], val ? parseInt(val, 10) : undefined])
          }}
          placeholder={`Max (${max})`}
          style={{
            width: '70px',
            marginLeft: '0.5rem',
          }}
        />
      </div>
    </>
  )
}

// @ts-ignore
export function filterGreaterThan(rows: Array<Row<any>>, id: Array<IdType<any>>, filterValue: FilterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id[0]]
    return rowValue >= filterValue
  })
}

export function SliderColumnFilter({
  // @ts-ignore
  column: { render, filterValue, setFilter, preFilteredRows, id },
}: FilterProps<TestCaseFlattened>) {
  const [min, max] = React.useMemo(() => getMinMax(preFilteredRows, id), [id, preFilteredRows])

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <TextField
        name={id}
        label={render('Header')}
        type="range"
        inputProps={{
          min,
          max,
        }}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10))
        }}
      />
      {filterValue || min}
      <CustomButton onlyIcon onClick={() => setFilter(undefined)}>
        <Clear />
      </CustomButton>
    </div>
  )
}

export function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  )
}

export const daysBack = 365

export function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export function getPlotConfig(staticPlot: boolean = false): Partial<Config> {
  return {
    staticPlot,
    frameMargins: 0,
    // displayModeBar: false,
    // responsive: true,
  }
}

interface TestCaseWithTimestamp extends TestCase {
  timestamp?: Date
}

export interface TestCaseFlattened {
  testSuite: TestSuiteType
  testCase: TestCaseWithTimestamp
}

export function getTestRunPlot(tableData: Array<TestCaseFlattened>) {
  const errors = tableData.filter((e) => e.testCase.failures.length > 0 || e.testCase.errors.length > 0)
  const errorsX = errors.map((e) => new Date(e.testCase.timestamp))
  const skips = tableData.filter((e) => e.testCase.skips.length > 0)
  const skipsX = skips.map((e) => new Date(e.testCase.timestamp))
  const passes = tableData.filter(
    (e) => e.testCase.skips.length == 0 && e.testCase.errors.length == 0 && e.testCase.failures.length == 0
  )
  const passesX = passes.map((e) => new Date(e.testCase.timestamp))
  const plotData: Array<Partial<PlotData>> = [
    {
      x: errorsX,
      y: errors.map((_) => -1),
      mode: 'markers',
      type: 'scatter',
      text: tableData.map((e) => `${e.testSuite.testSuiteStatic.name} ${e.testCase.testCaseStatic.name}`),
      name: 'Errors+Failures',
      marker: {
        color: 'red',
      },
    },
    {
      x: skipsX,
      y: skips.map((_) => 0),
      mode: 'markers',
      type: 'scatter',
      text: tableData.map((e) => `${e.testSuite.testSuiteStatic.name} ${e.testCase.testCaseStatic.name}`),
      name: 'Skipped',
      marker: {
        color: 'black',
      },
    },
    {
      x: passesX,
      y: passes.map((_) => 1),
      mode: 'markers',
      type: 'scatter',
      text: tableData.map((e) => `${e.testSuite.testSuiteStatic.name} ${e.testCase.testCaseStatic.name}`),
      name: 'Passes',
      marker: {
        color: 'green',
      },
    },
  ]
  return plotData
}
