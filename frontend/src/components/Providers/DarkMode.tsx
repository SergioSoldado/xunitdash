import useDarkMode from 'use-dark-mode'
import { COLORS } from '~/components/Theme/colors'
import { ReactElement } from 'react'

/*
This component handles client-side color scheme switching. Specifically, if the
user were to have the site open and change their light/dark mode preferences,
of if they are viewing the site at sunset and dark mode turns on automatically.
*/
export default function DarkMode(): ReactElement {
  const onChange = (isDark: boolean | undefined) => {
    const colorMode = isDark ? 'dark' : 'light'

    const root = document.documentElement

    Object.entries(COLORS).forEach(([name, colorByTheme]) => {
      const cssVarName = `--${name}`

      root.style.setProperty(cssVarName, colorByTheme[colorMode])
    })
  }

  useDarkMode(false, {
    storageKey: 'isDarkMode',
    onChange: onChange,
  })

  return <></>
}
