import React, {ReactElement} from 'react'
import Header from '~/components/Header'
import {
  PageContainer,
  InnerPageContainer,
  SectionHeading,
  ContentContainer,
  SectionHeadingCentered,
} from './style'
import Footer from '~/components/Footer'

export { SectionHeading, ContentContainer, SectionHeadingCentered }

interface Props {
  children: React.ReactNode
  withHeader?: boolean
}

export default function Page(props: Props): ReactElement {
  const { children, withHeader = false } = props
  return (
    <PageContainer>
      {withHeader && <Header />}
      <InnerPageContainer role="main">{children}</InnerPageContainer>
      <Footer />
    </PageContainer>
  )
}
