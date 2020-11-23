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
import Footer from './index'

const Container = styled.div`
  margin: 3rem;
`

storiesOf('Footer', module).add('Simple', () => (
  <Providers>
    <DarkModeToggleIcon />
    <FallbackStyles />
    <MagicScriptTag />
    <PageContainer>
      <Container>
        <p>{Dummy.text(100)}</p>
        <p>{Dummy.text(140)}</p>
      </Container>
      <Footer />
    </PageContainer>
  </Providers>
))
