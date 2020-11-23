import React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import {
  FallbackStyles,
  MagicScriptTag,
} from '~/components/Theme/InlineCssVariables'
import Providers from '~/components/Providers'
import DarkModeToggleIcon from '~/components/DarkModeToggleIcon'
import Input from './index'

const Container = styled.div`
  margin: 3rem;
`

storiesOf('Input', module).add('Simple', () => (
  <Providers>
    <DarkModeToggleIcon />
    <FallbackStyles />
    <MagicScriptTag />
    <Container>
      <Input
        labelText="Email address"
        id="email_address"
        formControlProps={{
          fullWidth: true,
        }}
        inputProps={{
          type: 'email',
        }}
      />
      <Input
        labelText="Password"
        id="password"
        formControlProps={{
          fullWidth: true,
        }}
        inputProps={{
          type: 'password',
          autoComplete: 'off',
        }}
      />
      <Input
        id="success"
        labelText="Success"
        formControlProps={{
          fullWidth: true,
        }}
        success
      />
      <Input
        id="successAdorned"
        labelText="Success w/Adornment"
        formControlProps={{
          fullWidth: true,
        }}
        success
        withAdornment
      />
      <Input
        id="error"
        labelText="Error"
        formControlProps={{
          fullWidth: true,
        }}
        error
      />
      <Input
        id="errorAdorned"
        labelText="Error w/Adornment"
        formControlProps={{
          fullWidth: true,
        }}
        error
        withAdornment
      />
    </Container>
  </Providers>
))
