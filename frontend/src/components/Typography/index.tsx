import styled, { css } from 'styled-components'
import theme from '~/components/Theme'

// captures the interaction on <Larr /> and <Rarr /> components
const arrows = css`
  &:hover {
    .rightArrow {
      opacity: 1;
      transform: translateX(8px);
      transition: transform ${theme.animations.default};
    }

    .leftArrow {
      opacity: 1;
      transform: translateX(-8px);
      transition: transform ${theme.animations.default};
    }
  }
`

const heading = css`
  font-family: 'Fjalla One', 'Helvetica', 'Arial', sans-serif;
  font-weight: ${theme.fontWeights.heading};
  color: var(--text-primary);
  line-height: ${theme.lineHeights.heading};
  letter-spacing: -0px;

  ${arrows}
`

export const h1 = css`
  ${heading};
  font-size: ${theme.fontSizes[6]};

  @media (max-width: ${theme.breakpoints[4]}) {
    font-size: ${theme.fontSizes[5]};
  }
`
export const H1 = styled.h1`
  ${h1};
  margin-top: 1rem;
  margin-bottom: 2rem;
`

export const h2 = css`
  ${heading};
  font-size: ${theme.fontSizes[5]};
  letter-spacing: -0.6px;
`
export const H2 = styled.h2`
  ${h2};

  @media (max-width: ${theme.breakpoints[4]}) {
    font-size: ${theme.fontSizes[4]};
  }

  margin-top: 2rem;
  margin-bottom: 1rem;
`

export const h3 = css`
  ${heading};
  font-size: ${theme.fontSizes[3]};
  letter-spacing: -0.6px;
`
export const H3 = styled.h3`
  ${h3};
`

export const h4 = css`
  ${heading};
  font-weight: 700;
  font-size: ${theme.fontSizes[2]};
`
export const H4 = styled.h4`
  ${h4};
`

export const h5 = css`
  ${heading};
  font-weight: 700;
  font-size: ${theme.fontSizes[1]};
`
export const H5 = styled.h5`
  ${h5};
`

export const h6 = css`
  font-weight: 700;
  font-size: ${theme.fontSizes[0]};
`
export const H6 = styled.h6`
  ${h6};
  font-weight: ${theme.fontWeights.body};
  letter-spacing: 0.2px;
`

export const p = css`
  font-size: ${theme.fontSizes[2]};
  font-weight: ${theme.fontWeights.body};
  line-height: ${theme.lineHeights.body};
  letter-spacing: -0.1px;
  color: var(--text-secondary);

  a {
    color: var(--text-link);
    text-decoration: none;
    font-weight: 500;
    word-break: break-word;
    hyphens: auto;
  }

  a:hover {
    text-decoration: underline;
  }

  code {
    font-size: ${theme.fontSizes[0]};
    box-shadow: inset 0 0 0 1px var(--border-primary);
  }

  a > code {
    padding: ${theme.space[0]} ${theme.space[1]};
    box-shadow: inset 0 0 0 1px rgba(var(--text-link-rgb), 0.16);
    border-radius: 4px;
    display: inline-block;
    background: rgba(var(--text-link-rgb), 0.12);
    color: var(--text-link);
  }

  a:hover > code {
    background: rgba(var(--text-link-rgb), 0.16);
  }
`

export const P = styled.p`
  ${p};
`

export const Small = styled(P)`
  font-size: ${theme.fontSizes[0]};
  color: var(--text-quaternary);

  a {
    font-weight: 400;
    color: var(--text-quaternary);
  }

  a:hover {
    color: var(--text-secondary);
  }

  a:visited {
    color: var(--text-quaternary);
  }
`

export const blockquote = css`
  ${p};
  padding-left: ${theme.space[4]};
  font-style: italic;
  color: var(--text-tertiary);
  display: block;
  position: relative;

  &:before {
    content: '';
    height: 100%;
    width: 4px;
    border-radius: 4px;
    background: var(--border-primary);
    position: absolute;
    left: 0;
  }
`
export const Blockquote = styled.blockquote`
  ${blockquote};
`

export const list = css`
  ${p};
  font-weight: ${theme.fontWeights.body};
  line-height: ${theme.fontWeights.body};
  color: var(--text-secondary);
  margin-left: 2rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`
export const Ul = styled.ul`
  ${list};
  list-style-type: circle;
  list-style-position: inside;
`

export const Ol = styled.ol`
  ${list};
  list-style-type: decimal;
  list-style-position: inside;
`

export const listItem = css`
  line-height: ${theme.lineHeights.body};
`
export const Li = styled.li`
  ${listItem}
`

export const pre = css`
  font-size: ${theme.fontSizes[0]};
  font-family: ${theme.fonts.monospace};
  padding: ${theme.space[3]};
  background: var(--bg-inset);
  text-shadow: none;
  border-radius: 8px;
  overflow-x: scroll;
  overflow-wrap: break-word;
  box-shadow: 0 0 0 1px var(--border-primary),
    inset 0 1px 4px rgba(0, 0, 0, 0.04);

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: ${theme.breakpoints[4]}) {
    font-size: ${theme.fontSizes[0]};
  }
`
export const Pre = styled.pre`
  ${pre};
`

export const code = css`
  font-size: ${theme.fontSizes[0]} !important;
  font-family: ${theme.fonts.monospace};
  padding: ${theme.space[0]} ${theme.space[1]};
  border-radius: 4px;
  display: inline-block;
  box-shadow: none !important;
  background: var(--bg-inset);
  text-shadow: none;
  padding: 0 0.3rem;

  @media (max-width: ${theme.breakpoints[4]}) {
    font-size: ${theme.fontSizes[0]};
  }
`
export const Code = styled.code`
  ${code};
`

export const Hr = styled.hr`
  width: 33%;
  margin: 0 auto;
  margin-top: 1em;
  border: 1px solid var(--border-primary);
`

export const A = styled.a`
  ${arrows}
  color: var(--text-link);
  font-weight: 500;
  display: inline-block;
`

const baseArrowStyles = css`
  position: relative;
  display: inline-block;
  opacity: 0.4;
  transition: all ${theme.animations.default};
  font-weight: ${theme.fontWeights.subheading};
`

export const Rarr = styled.span.attrs({
  children: '→',
  className: 'rightArrow',
})`
  opacity: 0.4;
  ${baseArrowStyles};
`

export const Larr = styled.span.attrs({
  children: '←',
  className: 'leftArrow',
})`
  transform: translateX(-4px);
  ${baseArrowStyles};
`

export const Subheading = styled(P)`
  font-size: ${theme.fontSizes[1]};
  font-weight: ${theme.fontWeights.subheading};
  line-height: 1.4;
  max-width: ${theme.breakpoints[4]};
  ${arrows}

  a {
    display: inline-block;
  }

  @media (max-width: ${theme.breakpoints[4]}) {
    max-width: 100%;
  }
`

export const LargeSubheading = styled(P)`
  font-size: ${theme.fontSizes[2]};
  font-weight: ${theme.fontWeights.subheading};
  line-height: 1.4;
  max-width: ${theme.breakpoints[4]};
  ${arrows}

  a {
    display: inline-block;
  }

  @media (max-width: ${theme.breakpoints[4]}) {
    max-width: 100%;
  }
`

export const img = css`
  max-width: 100%;
  border-radius: 4px;
`

interface LineClampProps {
  lines?: number
  children: any
}

export const LineClamp = styled.span`
  -webkit-line-clamp: ${(props: LineClampProps) => props.lines || 1};
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-box;
`

LineClamp.defaultProps = {
  lines: 1,
}
