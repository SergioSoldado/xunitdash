import React, { ReactElement } from 'react'
import Link from 'next/link'
import { A } from '~/components/Typography'
import DarkModeToggleIcon from '~/components/DarkModeToggleIcon'
import { Grid } from './style'

export default function Footer(): ReactElement {
  return (
    <Grid>
      <Link href="/">
        <A>Home</A>
      </Link>

      <A
        href="https://github.com/SergioSoldado/xunitdash"
        target="_blank"
        rel="noopener noreferrer"
      >
        @xunitdash
      </A>

      <DarkModeToggleIcon size="inherit" />
    </Grid>
  )
}
