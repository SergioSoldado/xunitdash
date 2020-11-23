import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'
import Dummy from 'dummyjs'
import {
  FallbackStyles,
  MagicScriptTag,
} from '~/components/Theme/InlineCssVariables'
import Providers from '~/components/Providers'
import DarkModeToggleIcon from '~/components/DarkModeToggleIcon'
import Table from './index'
import { H4 } from '~/components/Typography'

const Container = styled.div`
  margin: 3rem;
`

const tableHead = [<H4>Head1</H4>, <H4>Head2</H4>, <H4>Head3</H4>, <H4>Head4</H4>, ]
const tableData = [[<p>{Dummy.text(3)}</p>, <p>{Dummy.text(3)}</p>, <p>{Dummy.text(3)}</p>, <p>{Dummy.text(3)}</p>]]

storiesOf('Table', module).add('Simple', () => (
  <Providers>
    <DarkModeToggleIcon />
    <FallbackStyles />
    <MagicScriptTag />
    <Container>
      <Table
        tableHead={tableHead}
        tableData={tableData}
      />
    </Container>
  </Providers>
))
