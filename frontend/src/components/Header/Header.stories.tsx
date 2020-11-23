import React from 'react'
import { storiesOf } from '@storybook/react'
import Dummy from 'dummyjs'
import styled from 'styled-components'
import {
  FallbackStyles,
  MagicScriptTag,
} from '~/components/Theme/InlineCssVariables'
import Providers from '~/components/Providers'
import DarkModeToggleIcon from '~/components/DarkModeToggleIcon'
import { PageContainer } from '~/components/Page/style'
import Header from './index'

const Container = styled.div`
  margin: 3rem;
`

storiesOf('Header', module).add('Simple', () => (
  <Providers>
    <DarkModeToggleIcon />
    <FallbackStyles />
    <MagicScriptTag />
    <PageContainer>
      <Container>
        <p>{Dummy.text(100)}</p>
        <p>{Dummy.text(140)}</p>
      </Container>
      <Header />
    </PageContainer>
  </Providers>
))
