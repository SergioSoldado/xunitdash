import React, { PropsWithChildren } from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import styled, { ThemeProvider } from 'styled-components'
import theme from '~/components/Theme'
import { Check, Clear } from '@material-ui/icons'
import { InputAdornment } from '@material-ui/core'

interface Props extends PropsWithChildren<any> {
  id: string
  labelText: React.ElementType | string
  formControlProps?: object
  helperText?: React.ElementType | string
  labelProps?: object
  inputProps?: object
  error?: boolean
  success?: boolean
  withAdornment?: boolean
  onChange?: (event: object) => void
}

const StyledInputLabel = styled(InputLabel)`
  color: var(--text-primary) !important;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.42857;
  top: 10px;
  letter-spacing: unset;
  z-index: 10;
  & + $underline {
    margin-top: 0px;
  }
  ${({ theme }) => (theme.error ? 'color: var(--accent-red) !important;' : '')}
  ${({ theme }) =>
    theme.success ? 'color: var(--accent-green) !important;' : ''}
`

const underlineStyles = (props: Props) => {
  const { error, success } = props
  const errorStyle = !error
    ? ''
    : `
  &:after {
    border-color: var(--accent-red);
  }
  `
  const successStyle = !(success && !error)
    ? ''
    : `
   &:after {
     border-color: var(--accent-green);
   }
  `

  return `
  &:hover,&:before {
    border-color: var(--text-placeholder) !important;
    border-width: 1px !important;
  },
  &:after {
    border-color: var(--text-primary);
  },
  & + p {
    font-weight: 300;
  }
  ${errorStyle}
  ${successStyle}
  `
}

const StyledInput = styled(Input)`
  color: var(--text-primary);
  // .MuiInputBase-input {
  //   background-color: var(--bg-secondary);
  // }

  & .input {
    color: var(--text-primary);
    height: unset;
    &,
    &::placeholder {
      font-size: 14px;
      font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
      font-weight: 400;
      line-height: 1.42857;
      opacity: 1;
    }
    ,
    &::placeholder {
      color: gray-color[3];
    }
  }

  & .label {
    background-color: purple;
  }

  &.disabled {
    color: black;
    background-color: orange;
    .label {
      background-color: green;
    }
  }
  ${({ theme }) => underlineStyles(theme)}
`

const StyledFormControl = styled(FormControl)`
  margin: 0 0 17px 0;
  padding-top: 27px;
  position: relative;
  vertical-align: unset;
  & svg,
  & .fab,
  & .far,
  & .fal,
  & .fas,
  & .material-icons {
    color: var(--text-primary);
  }
`

const StyledInputAdornment = styled(InputAdornment)`
  margin-right: 8px;
  position: relative;
  ${({ theme }) => (theme.error ? 'color: var(--accent-red) !important;' : '')}
  ${({ theme }) =>
    theme.success ? 'color: var(--accent-green) !important;' : ''}
`

const StyledFormHelperText = styled(FormHelperText)`
  ${({ theme }) => (theme.error ? 'color: var(--accent-red) !important;' : '')}
  ${({ theme }) =>
    theme.success ? 'color: var(--accent-green) !important;' : ''}
`

const StyledCheck = styled(Check)`
  color: var(--accent-green) !important;
`

const StyledCross = styled(Clear)`
  color: var(--accent-red) !important;
`

export default function CustomInput(props: Props) {
  const {
    id,
    labelText,
    helperText,
    labelProps = {},
    inputProps = {},
    formControlProps = {},
    success = false,
    error = false,
    withAdornment = false,
    onChange = () => {}
  } = props

  const customTheme = {
    ...theme,
    success,
    error,
  }

  let newInputProps = {
    maxLength:
    // @ts-ignore ToDo use mui types
      inputProps && inputProps.maxLength ? inputProps.maxLength : undefined,
    minLength:
    // @ts-ignore
      inputProps && inputProps.minLength ? inputProps.minLength : undefined,
  }

  let endAdornment = undefined
  if (withAdornment) {
    endAdornment = (
      // @ts-ignore
      <StyledInputAdornment theme={customTheme}>
        {success && !error ? <StyledCheck /> : undefined}
        {error && !success ? <StyledCross /> : undefined}
      </StyledInputAdornment>
    )
  }

  return (
    <ThemeProvider theme={customTheme}>
      <StyledFormControl {...formControlProps}>
        {labelText !== undefined ? (
          <StyledInputLabel htmlFor={id} {...labelProps}>
            {labelText}
          </StyledInputLabel>
        ) : null}
        <StyledInput
          id={id}
          {...inputProps}
          endAdornment={endAdornment}
          inputProps={newInputProps}
          onChange={onChange}
        />
        {helperText !== undefined ? (
          <StyledFormHelperText id={id + '-text'}>
            {helperText}
          </StyledFormHelperText>
        ) : null}
      </StyledFormControl>
    </ThemeProvider>
  )
}
