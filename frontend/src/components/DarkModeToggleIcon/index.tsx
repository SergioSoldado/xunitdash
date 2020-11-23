import React, { ReactElement } from 'react'
import useDarkMode from 'use-dark-mode'
import { BrightnessHigh, Brightness3 } from '@material-ui/icons'

interface Props {
  size?: 'small' | 'inherit' | 'large'
}

export default function DarkModeToggleIcon({ size = 'inherit' }: Props): ReactElement {
  const darkMode = useDarkMode(false, {
    storageKey: 'isDarkMode',
  })
  return (
    <a onClick={darkMode.toggle}>
      {darkMode.value ? (
        <BrightnessHigh fontSize={size} />
      ) : (
        <Brightness3 fontSize={size} />
      )}
    </a>
  )
}

DarkModeToggleIcon.defaultProps = {
  size: '1rem',
}
