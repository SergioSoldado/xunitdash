import React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import GraphSunburst from './index'
import {
  FallbackStyles,
  MagicScriptTag,
} from '~/components/Theme/InlineCssVariables'
import Providers from '~/components/Providers'
import DarkModeToggleIcon from '~/components/DarkModeToggleIcon'

const Container = styled.div`
  margin: 3rem;
`

const data = {
  children: [
      {
        name: 'fruit',
        size: '10',
        children: [
          {
            name: 'apple',
            size: '5'
          },
          {
            name: 'pear',
            size: '5'
          }
        ]
      }
    ],
  name: '.',
  size: '50',
}

storiesOf('GraphSunburst', module).add('Simple', () => (
  <Providers>
    <DarkModeToggleIcon />
    <FallbackStyles />
    <MagicScriptTag />
    <Container>
      <GraphSunburst data={data} />
    </Container>
  </Providers>
))
