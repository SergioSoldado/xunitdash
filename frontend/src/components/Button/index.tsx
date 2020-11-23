import React, { PropsWithChildren } from 'react'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import theme from '~/components/Theme'

const transparent = `
  &,&:focus,&:hover {
    color: inherit;
    background: transparent;
  }
`

const rounded = 'border-radius: 1.5rem;'
const fullWidth = 'width: 100%;'

const disabled = `
  opacity: 0.65;
  pointer-events: none;
`

const small = `
  padding: 0.40625rem 1.25rem;
  font-size: 0.6875rem;
  border-radius: 0.2rem;
`

const large = `
  padding: 1.125rem 2.25rem;
  font-size: 0.875rem;
  line-height: 1.333333;
  border-radius: 0.2rem;
`

const color = (theme: Props) => {
  return `
  color: ${theme.color};
  &,&:focus,&:hover {
    color: ${theme.color};
  }
  `
}

const icon = (theme: Props) => {
  const base = `
    padding-left: 12px;
    padding-right: 12px;
    font-size: 20px;
    height: 41px;
    min-width: 41px;
    width: 41px;
    border-radius: 50%;
    & .fab,& .fas,& .far,& .fal,& svg,& .material-icons {
      margin-right: 0px;
    }
    `
  if (theme.large) {
    return `
    ${base}
    height: 57px;
    min-width: 57px;
    width: 57px;
    & .fab,& .fas,& .far,& .fal,& .material-icons .material-label {
      font-size: 32px;
      line-height: 56px;
    }
    & svg {
      width: 32px;
      height: 32px;
    }`
  }
  if (theme.small) {
    return `
    ${base}
    height: 30px;
    min-width: 30px;
    width: 30px;
    & .fab,& .fas,& .far,& .fal,& .material-icons {
      font-size: 17px;
      line-height: 29px;
      margin: 0;
    }
    & svg {
      width: 17px;
      height: 17px;
    }`
  }
  return base
}

const onlyIcon = `
padding: 0;
&,&:focus,&:hover {
  color: var(--text-primary);
  background: transparent;
  box-shadow: none;
},
`

const StyledButton = styled(Button)`
  min-height: auto;
  min-width: auto;
  color: var(--text-on-primary);
  background-color: var(--text-quaternary);
  box-shadow: ${({theme}) => theme.shadows.button};
  border: none;
  border-radius: 0.25rem;
  position: relative;
  padding: 12px 30px;
  margin: 0.3125rem 1px;
  font-size: ${({ theme }) => theme.fontSizes[0]};
  font-weight: ${({ theme }) => theme.fontWeights.button};
  text-transform: uppercase;
  letter-spacing: 0;
  will-change: box-shadow, transform;
  transition: box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1),
    background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: ${({ theme }) => theme.lineHeights.body};
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  & .fab,& .fas,& .far,& .fal,& svg,& .material-icons {
    font-weight: 300;
  }
  &:hover,
  &:focus {
    color: var(--text-on-primary);
    background-color: var(--text-tertiary);
    box-shadow: ${(props) => props.theme.shadows.hover};
  }
  & .fab,
  & .fas,
  & .far,
  & .fal,
  & .material-icons {
    position: relative;
    display: inline-block;
    top: 0;
    margin-top: -1em;
    margin-bottom: -1em;
    font-size: 1.1rem;
    margin-right: 4px;
    vertical-align: middle;
  }
  & svg {
    position: relative;
    display: inline-block;
    top: 0;
    width: 18px;
    height: 18px;
    margin-right: 4px;
    vertical-align: middle;
  }
  ${({ theme }) => (theme.transparent ? transparent : '')}
  ${({ theme }) => (theme.disabled ? disabled : '')}
  ${({ theme }) => (theme.small ? small : '')}
  ${({ theme }) => (theme.large ? large : '')}
  ${({ theme }) => (theme.rounded ? rounded : '')}
  ${({ theme }) => (theme.icon ? icon(theme) : '')}
  ${({ theme }) => (theme.fullWidth ? fullWidth : '')}
  ${({ theme }) => (theme.onlyIcon ? onlyIcon : '')}
  ${({ theme }) => (theme.color !== undefined ? color(theme) : '')}
`

interface Props extends PropsWithChildren<any> {
  rounded?: boolean
  transparent?: boolean
  disabled?: boolean
  small?: boolean
  large?: boolean
  icon?: boolean
  fullWidth?: boolean
  onlyIcon?: boolean
  color?: string | undefined
}

const CustomButton = React.forwardRef((props: Props, ref) => {
  const {
    rounded = false,
    transparent = false,
    disabled = false,
    small = false,
    large = false,
    icon = false,
    fullWidth = false,
    onlyIcon = false,
    color,
    children,
    ...others
  } = props

  const customTheme = {
    ...theme,
    rounded,
    transparent,
    disabled,
    small,
    large,
    icon,
    fullWidth,
    onlyIcon,
    color,
  }

  return (
    // @ts-ignore
    <StyledButton theme={customTheme} {...others} ref={ref}>
      {children}
    </StyledButton>
  )
})

export default CustomButton
