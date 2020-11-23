import React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import {
  FallbackStyles,
  MagicScriptTag,
} from '~/components/Theme/InlineCssVariables'
import Providers from '~/components/Providers'
import DarkModeToggleIcon from '~/components/DarkModeToggleIcon'
import Button from './index'

const Container = styled.div`
  margin: 3rem;
`

const StyledIcon = styled.i`
  font-size: 18px;
  margin-top: -2px;
  position: relative;
`

storiesOf('Button', module).add('Simple', () => (
  <Providers>
    <DarkModeToggleIcon />
    <FallbackStyles />
    <MagicScriptTag />
    <Container>
      <Button>Plain</Button>
      <Button
        onClick={() => {
          alert('clicked')
        }}
      >
        Plain w/Listener
      </Button>
      <Button disabled>Disabled</Button>
      <Button rounded>Rounded</Button>
      <Button transparent>Transparent</Button>
      <Button rounded transparent>
        Rounded&Transparent
      </Button>
      <Button small>Small</Button>
      <Button large>Large</Button>
      <Button rounded>
        <StyledIcon className=" fab fa-twitter" /> Rounded With Icon
      </Button>
      <Button icon rounded small>
        <StyledIcon className=" fab fa-twitter" />
      </Button>
      <Button icon rounded>
        <StyledIcon className=" fab fa-twitter" />
      </Button>
      <Button icon rounded large>
        <StyledIcon className=" fab fa-twitter" />
      </Button>
      <Button fullWidth>Full width</Button>
      <Button onlyIcon>
        <StyledIcon className=" fab fa-twitter" />
      </Button>
      <Button onlyIcon color="blue">
        <StyledIcon className=" fab fa-twitter" />
      </Button>
    </Container>
  </Providers>
))
