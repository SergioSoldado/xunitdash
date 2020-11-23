import styled, { css } from 'styled-components'
import theme from '~/components/Theme'

const SizeResponsive = css`
  max-width: 900px;
  @media (max-width: ${theme.breakpoints[3]}) {
    max-width: 760px;
  }
  @media (max-width: ${theme.breakpoints[5]}) {
    max-width: 100%;
  }
`

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  max-width: 100%;
`

export const ContentContainer = styled.div`
  width: 100%;
  ${SizeResponsive}
`

export const InnerPageContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  flex: 1 0 auto;
  width: 100%;
  padding: 0 ${theme.space[3]};
  padding-top: ${theme.space[7]};
  padding-bottom: ${theme.space[7]};

  @media (max-width: ${theme.breakpoints[4]}) {
    max-width: 100%;
  }
`

export const SectionHeading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  ${SizeResponsive}
`

export const SectionHeadingCentered = styled.div`
  ${SectionHeading}
  text-align: center;
`

export const FullscreenContainer = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;
  justify-items: center;
  padding: 72px 24px;
  min-height: 100%;
`

export const FullscreenContent = styled.div`
  display: grid;
  text-align: center;
  grid-auto-rows: min-content;
  align-items: center;
  justify-content: center;
  justify-items: center;
  gap: ${theme.space[3]};
`
