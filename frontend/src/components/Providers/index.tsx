import React from 'react'
import Router from 'next/router'
import { StylesProvider } from '@material-ui/core/styles'
import GlobalStyles from '~/components/GlobalStyles'
import SEO from './SEO'
import DarkMode from './DarkMode'
import withGA from 'next-ga'

interface Props {
  children?: any
}

const Index = ({ children }: Props) => {
  return (
    <StylesProvider injectFirst>
      <SEO />
      <DarkMode />
      <GlobalStyles.ResetStyles />

      {children}
    </StylesProvider>
  )
}

export default withGA(process.env.GA_TRACKING_ID, Router)(Index)
