import * as React from 'react'
import Masonry from 'react-masonry-css'
import { ReactElement } from 'react'
import styled from 'styled-components'

const breakpointColumns = {
  default: 4,
  1400: 3,
  1100: 2,
  700: 1,
}

const StyledMasonry = styled(Masonry)`
  display: -webkit-box;
  display: ms-flexbox;
  display: flex;
  width: 100%;
`

interface Props {
  children: React.ReactElement[] | React.ReactElement | any
  breakpoints?: { default: number, [key: number]: number }
}

export default function Grid({ children, breakpoints = breakpointColumns }: Props): ReactElement {
  return (
    <>
      <StyledMasonry
        breakpointCols={breakpoints}
        className="masonryGrid"
        columnClassName="masonryGridColumn"
      >
        {children}
      </StyledMasonry>
      <style jsx global>{`
        .masonryGridColumn {
          background-clip: padding-box;
        }
        .masonryGridColumn:last-child {
          padding-right: 1em;
        }
      `}</style>
    </>
  )
}
