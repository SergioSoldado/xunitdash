import * as React from 'react'
import styled from 'styled-components'
import { ReactElement } from 'react'

const GridItemDiv = styled.div`
  margin: 1rem 0 0 1rem;
  position: relative;
`

interface Props {
  children: any
  className?: string | undefined
}

export default function GridItem(props: Props): ReactElement {
  return <GridItemDiv {...props} />
}
