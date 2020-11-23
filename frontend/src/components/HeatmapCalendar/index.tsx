import React from 'react'
import ReactTooltip from 'react-tooltip'
import CalendarHeatmap from 'react-calendar-heatmap'

export interface CalendarSample {
  date: Date
  count: number
}

const getTooltipDataAttrs = (day: CalendarSample) => {
  if (!day || !day.date) {
    return null
  }
  // Configuration for react-tooltip
  const d = new Date(day.date)
  const date = d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return {
    'data-tip': `${day.count} entries on ${date}`,
  }
}

const getClassForValue = (day: CalendarSample, maxCount: number) => {
  if (!day) {
    return 'color-empty'
  }
  let v = Math.trunc((4 * day.count) / maxCount)
  if (day.count !== 0 && v === 0) {
    v += 1
  }
  return `color-gitlab-${v}`
}

export interface Props {
  maxDailySamples: number
  calendarSamples: Array<CalendarSample>
  startDate: Date
  endDate: Date
  onClick?: (_: Date) => void,
  showWeekdays?: boolean
}

export default function HeatmapCalendar({
  calendarSamples,
  maxDailySamples,
  startDate,
  endDate,
  onClick = () => null,
  showWeekdays = false,
}: Props): React.ReactElement {
  return (
    <>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        showWeekdayLabels={showWeekdays}
        values={calendarSamples}
        classForValue={(value: CalendarSample) =>
          getClassForValue(value, maxDailySamples)
        }
        tooltipDataAttrs={getTooltipDataAttrs}
        onClick={(value: CalendarSample) => {
          if (value == null || value.date == null) return 'null'
          const d = new Date(value.date)
          d.setHours(0, 0, 0, 0)
          if (onClick) {
            onClick(d)
          }
        }}
      />
      <ReactTooltip type="info" />
      <style jsx global>{`
        .react-calendar-heatmap-weekday-labels {
          transform: translate(0px, 10px);
        }
      `}</style>
    </>
  )
}
