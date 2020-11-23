import React from 'react'
import styled from 'styled-components'
import Dummy from 'dummyjs'
import { storiesOf } from '@storybook/react'

import {
  FallbackStyles,
  MagicScriptTag,
} from '~/components/Theme/InlineCssVariables'
import Providers from '~/components/Providers'
import DarkModeToggleIcon from '~/components/DarkModeToggleIcon'
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Ul,
  Ol,
  Li,
  P,
  Small,
  Blockquote,
  Pre,
  Subheading,
  LargeSubheading,
  Code,
  Hr,
  A,
  Rarr,
  Larr,
  LineClamp,
} from '~/components/Typography'

const headerText = Dummy.text(8)
const paragraphText = Dummy.text(150)

const Container = styled.div`
  margin: 3rem;
`

const Separator = styled.p`
  text-decoration: underline;
  margin-top: 1rem;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
`

storiesOf('Typography', module).add('Simple', () => (
  <Providers>
    <DarkModeToggleIcon />
    <FallbackStyles />
    <MagicScriptTag />

    <Container>
      <Separator>H1</Separator>
      <H1>{headerText}</H1>

      <Separator>H2</Separator>
      <H2>{headerText}</H2>

      <Separator>H3</Separator>
      <H3>{headerText}</H3>

      <Separator>H4</Separator>
      <H4>{headerText}</H4>

      <Separator>H5</Separator>
      <H5>{headerText}</H5>

      <Separator>H6</Separator>
      <H6>{headerText}</H6>

      <Separator>Large Sub Heading</Separator>
      <LargeSubheading>{headerText}</LargeSubheading>

      <Separator>Sub Heading</Separator>
      <Subheading>{headerText}</Subheading>

      <Separator>paragraph</Separator>
      <P>{paragraphText}</P>

      <Separator>small</Separator>
      <Small>{paragraphText}</Small>

      <Separator>Block Quote</Separator>
      <Blockquote>{paragraphText}</Blockquote>

      <Separator>Pre</Separator>
      <Pre>{paragraphText}</Pre>

      <Separator>Unordered List</Separator>
      <Ul>
        <Li>{headerText}</Li>
        <Li>{headerText}</Li>
        <Li>{headerText}</Li>
        <Li>{headerText}</Li>
      </Ul>

      <Separator>Ordered List</Separator>
      <Ol>
        <Li>{headerText}</Li>
        <Li>{headerText}</Li>
        <Li>{headerText}</Li>
        <Li>{headerText}</Li>
      </Ol>

      <Separator>Code</Separator>
      <Code>{paragraphText}</Code>

      <Separator>Horizontal Ruler</Separator>
      <Hr />

      <Separator>Link</Separator>
      <A>{paragraphText}</A>

      <Separator>Right Arrow</Separator>
      <Rarr />

      <Separator>Left Arrow</Separator>
      <Larr />

      <Separator>Line Clamp</Separator>
      <LineClamp>{headerText}</LineClamp>

      <br />
    </Container>
  </Providers>
))
