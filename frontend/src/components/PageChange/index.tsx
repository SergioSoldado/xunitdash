import React, { ReactElement } from 'react'
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'
import theme from '../Theme'

const MyCircularProgress = styled(CircularProgress)`
  &.MuiCircularProgress-root {
    color: var(--info-color);
    width: 670px !important,
    height: 6rem !important,
  }
`

const WrapperDiv = styled.div`
  margin: 100px auto;
  padding: 0px;
  max-width: 360px;
  text-align: center;
  position: relative;
  z-index: 9999;
  top: 0;
`

const IconWrapper = styled.div`
  display: block;
`

const Title = styled.div`
  text-decoration: none;
  font-weight: 700;
  margin-top: 30px;
  margin-bottom: 25px;
  min-height: 32px;
  color: ${theme.colors['info-color']};
`

interface Props {
  path: string
}

export default function PageChange({ path }: Props): ReactElement {
  return (
    <div>
      <WrapperDiv>
        <IconWrapper>
          <MyCircularProgress />
        </IconWrapper>
        <h4 className={Title}>Loading page contents for: {path}</h4>
      </WrapperDiv>
    </div>
  )
}
