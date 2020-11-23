import React from 'react'
import { storiesOf } from '@storybook/react'
import styled from '@emotion/styled'
import * as ld from 'lodash'
import Dummy from 'dummyjs'
import Grid from './index'
import GridItem from '~/components/GridItem'
import {
  FallbackStyles,
  MagicScriptTag,
} from '~/components/Theme/InlineCssVariables'
import Providers from '~/components/Providers'
import DarkModeToggleIcon from '~/components/DarkModeToggleIcon'
import { getRandomInt } from '~/lib/mathUtils'

const Container = styled.div`
  margin: 3rem;
  display: flex;
  flex-direction: row;
  flex: 1 0 auto;
  justify-content: flex-start;
  align-items: center;
`

const StyledItem = styled.div`
  width: 100%;
  background-color: #333;
  text-align: center;
`

storiesOf('Layouts', module).add('Grid', () => (
  <Providers>
    <DarkModeToggleIcon />
    <FallbackStyles />
    <MagicScriptTag />
    <Container>
      <Grid>
        {ld.range(100).map((_) => (
          <GridItem>
            <StyledItem>{Dummy.text(getRandomInt(100))}</StyledItem>
          </GridItem>
        ))}
      </Grid>
    </Container>
  </Providers>
))
