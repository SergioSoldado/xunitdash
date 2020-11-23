import React, { ReactElement } from 'react'
import dynamic from 'next/dynamic'
import { Config, Layout } from 'plotly.js'
import { GenericRunData } from '~/lib/junit/types'
import styled from 'styled-components'

const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
})

const PlotContainer = styled.div`
  padding-top: 30.25%;
  position: relative; /* If you want text inside of it */
`

const StyledPlot = styled(Plot)`
  position: absolute !important;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`

interface Props {
  data: Array<GenericRunData>
}

export default function SummaryPlot(props: Props): ReactElement {
  const plotLayout: Partial<Layout> = {
    autosize: true,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 50,
      pad: 0,
    },
    hovermode: 'closest',
    plot_bgcolor: '#00000000',
    paper_bgcolor: '#00000000',
  }

  const plotConfig: Partial<Config> = {
    frameMargins: 0,
    responsive: true,
    modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d'],
  }

  const { data } = props

  // const plotData = React.useMemo(() => {
    console.log('Creating plot data again plot')
    const x = data.map((item) => new Date(item.timestamp))
    const plotData = [
      {
        x,
        y: data.map((item) => item.errors),
        stackgroup: 'one',
        // groupnorm: 'percent',
        name: 'Errors',
        line: {
          color: 'red',
        },
      },
      {
        x,
        y: data.map((item) => item.failures),
        stackgroup: 'one',
        name: 'Failures',
        line: {
          color: 'black',
        },
      },
      {
        x,
        y: data.map((item) => item.skipped),
        stackgroup: 'one',
        name: 'Skipped',
        line: {
          color: 'purple',
        },
      },
      {
        x,
        y: data.map((item) => item.tests - item.errors - item.failures - item.skipped),
        stackgroup: 'one',
        name: 'Pass',
        line: {
          color: 'green',
        },
      },
    ]
    // return plotData
  // }, data)
  console.log('Rerender plot')
  return (
    <PlotContainer>
      <StyledPlot useResizeHandler layout={plotLayout} data={plotData} config={plotConfig} />
    </PlotContainer>
  )
}
