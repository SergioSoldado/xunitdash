import React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import {
  FallbackStyles,
  MagicScriptTag,
} from '~/components/Theme/InlineCssVariables'
import Providers from '~/components/Providers'
import DarkModeToggleIcon from '~/components/DarkModeToggleIcon'
import Loader from './index'

const Container = styled.div`
  margin: 1rem;
`

storiesOf('Loader', module).add('Simple', () => (
  <Providers>
    <DarkModeToggleIcon />
    <FallbackStyles />
    <MagicScriptTag />
    <Container>
      <Loader />
    </Container>
  </Providers>
))
