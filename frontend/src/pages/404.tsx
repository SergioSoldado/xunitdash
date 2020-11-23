import React from 'react'
import { ReactElement } from 'react'
import { H1, H2 } from '~/components/Typography'
import Page from '~/components/Page'

export default function Error(): ReactElement {
  React.useEffect(() => {
    window.scrollTo(0, 0)
    document.body.scrollTop = 0
  })
  return (
    <Page>
      <H1>404</H1>
      <H2>Page not found</H2>
    </Page>
  )
}
