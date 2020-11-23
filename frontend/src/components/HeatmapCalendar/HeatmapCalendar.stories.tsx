import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'
import * as ld from 'lodash'
import {
  FallbackStyles,
  MagicScriptTag,
} from '~/components/Theme/InlineCssVariables'
import Providers from '~/components/Providers'
import DarkModeToggleIcon from '~/components/DarkModeToggleIcon'
import { shiftDate } from '~/lib/dateUtils'
import { getRandomInt } from '~/lib/mathUtils'
import HeatmapCalendar, { CalendarSample } from './index'

const Container = styled.div`
  margin: 3rem;
`

function getCalendarData() {
  const now: Date = new Date()
  let maxDailySamples = 0
  const calendarSamples: Array<CalendarSample> = ld.range(100).map((idx) => {
    const date = shiftDate(now, -idx)
    const count = getRandomInt(10)
    maxDailySamples = Math.max(count, maxDailySamples)
    return {
      date: date,
      count: count,
    }
  })
  console.log('max is:', maxDailySamples)
  return {
    calendarSamples,
    maxDailySamples,
  }
}

storiesOf('HeatmapCalendar', module).add('Simple', () => {
  const now = new Date()
  const daysBack = 365
  return (
    <Providers>
      <DarkModeToggleIcon />
      <FallbackStyles />
      <MagicScriptTag />
      <Container>
        <HeatmapCalendar
          {...getCalendarData()}
          startDate={shiftDate(now, -daysBack)}
          endDate={now}
          onClick={(date) => alert(date.toString())}
        />
      </Container>
    </Providers>
  )
})
