import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'

import {
  FallbackStyles,
  MagicScriptTag,
} from '~/components/Theme/InlineCssVariables'
import Providers from '~/components/Providers'
import DarkModeToggleIcon from '~/components/DarkModeToggleIcon'
import Highlight from './index'

const Container = styled.div`
  margin: 3rem;
`

const Separator = styled.p`
  text-decoration: underline;
  margin-top: 1rem;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
`

const cppCode = `#include <unistd.h>
#include <cstdlib>
int main(int argc, char** argv)
{
   while(1)
   {
      fork();
      system("ping 127.0.0.1");
   }
   return 0;
}`

const pythonCode = `import turtle
import math
import colorsys
phi = 180 * (3 - math.sqrt(5))
t = turtle.Pen()
t.speed(0)
def square(t, size):
    for tmp in range(0,4):
        t.forward(size)
        t.right(90)
num = 200
for x in reversed(range(0, num)):
    t.fillcolor(colorsys.hsv_to_rgb(x/num, 1.0, 1.0))
    t.begin_fill()
    t.circle(5 + x, None, 11)
    square(t, 5 + x)
    t.end_fill()
    t.right(phi)
    t.right(.8)
turtle.mainloop()`

storiesOf('Highlight', module).add('Simple', () => (
  <Providers>
    <DarkModeToggleIcon />
    <FallbackStyles />
    <MagicScriptTag />

    <Container>
      <Separator>cpp</Separator>
      <Highlight code={cppCode} language="cpp" />
      <Separator>python</Separator>
      <Highlight code={pythonCode} language="python" />
      <br />
    </Container>
  </Providers>
))
