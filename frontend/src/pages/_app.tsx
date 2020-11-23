import React, { ReactElement } from 'react'
import ReactDOM from 'react-dom'
import { AppProps } from 'next/app'
import Router from 'next/router'
import Providers from '~/components/Providers'
import PageChange from '~/components/PageChange'
import '~/components/GlobalStyles/theme.css'
import 'react-calendar-heatmap/dist/styles.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import 'react-datetime/css/react-datetime.css'

Router.events.on('routeChangeStart', (url) => {
  // console.log(`Loading: ${url}`)
  document.body.classList.add('body-page-transition')
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById('page-transition')
  )
})

Router.events.on('routeChangeComplete', () => {
  const el: HTMLElement | null = document.getElementById('page-transition')
  if (el) {
    ReactDOM.unmountComponentAtNode(el)
  }
  document.body.classList.remove('body-page-transition')
})

Router.events.on('routeChangeError', () => {
  const el: HTMLElement | null = document.getElementById('page-transition')
  if (el) {
    ReactDOM.unmountComponentAtNode(el)
  }
  document.body.classList.remove('body-page-transition')
})

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  )
}
