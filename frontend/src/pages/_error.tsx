import React, { ReactElement } from 'react'
import Router from 'next/router'

export default class _error extends React.Component {
  componentDidMount(): void {
    Router.push('/').then()
  }

  render(): ReactElement {
    return <div />
  }
}
