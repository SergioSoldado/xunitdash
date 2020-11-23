import React, { ReactElement } from 'react'
import { createGlobalStyle } from 'styled-components'
import * as d3 from 'd3'
import * as ld from 'lodash'
import Sunburst from './sunburst'

type Props = {
  data: Record<string, unknown>
  width?: number
  height?: number
  getToolTip?: (val: number) => string
  onClick?: (d: object) => void
}

const GlobalStyles = createGlobalStyle`
  .sunburst-viz .slice path {
    cursor: pointer;
    shape-rendering: geometricPrecision;
  }

  .sunburst-viz text {
    font-size: 1rem;
    dominant-baseline: middle;
    text-anchor: middle;
    pointer-events: none;
    fill: var(--text-primary);
  }

  .sunburst-viz text .text-contour {
    fill: none;
    stroke: var(--bg-primary);
    stroke-width: 3px;
    stroke-linejoin: round;
  }
  
  .sunburst-viz {
    & .svg {
      width: 200px;
      height: 100px;
    }
  }

  .sunburst-viz .main-arc {
  }

  .sunburst-viz .main-arc:hover {
    opacity: 0.85;
    transition: opacity 0.05s;
  }

  .sunburst-viz .hidden-arc {
    fill: none;
  }

  .sunburst-tooltip {
    display: none;
    position: absolute;
    white-space: nowrap;
    padding: 5px;
    border-radius: 3px;
    font: 12px sans-serif;
    color: #eee;
    background: rgba(0, 0, 0, 0.65);
    pointer-events: none;
  }

  .sunburst-tooltip .tooltip-title {
    font-weight: bold;
    text-align: center;
    margin-bottom: 5px;
  }
`

class DiskUsage extends React.Component<Props, Readonly<Record<string, unknown>>> {
  componentDidMount(): void {
    const { data, getToolTip = (val) => val, width, height, onClick = () => null } = this.props

    setTimeout(() => {
      const color = d3.scaleOrdinal(d3.schemePaired)

      Sunburst()
        .width(width)
        .height(height)
        .data(data)
        .label('name')
        .size('size')
        // @ts-ignore
        .color((d, parent) => {
          if (ld.has(d, 'color')) {
            return d['color']
          }
          return color(parent ? parent.data.name : null)
        })
        .tooltipContent(
          // @ts-ignore
          (d, node) => getToolTip(node.value)
        )(document.getElementById('chart'))
        .onClick(onClick)
    }, 1000)
  }

  render(): ReactElement {
    return (
      <>
        <GlobalStyles />
        <div id="chart" />
      </>
    )
  }
}

export default DiskUsage
