import { createGlobalStyle } from 'styled-components'
import theme from '~/components/Theme'

const ResetStyles = createGlobalStyle`
  * {
    border: 0;
    box-sizing: inherit;
    -webkit-font-smoothing: antialiased;
    font-weight: inherit;
    margin: 0;
    padding: 0;
    text-decoration: none;
    text-rendering: optimizeLegibility;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
  
  // Fonts
  
  // Prevent highlight on mobile
  * {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
    &:focus {
      outline: 0;
    }
  }
  
  // Scrollback
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--text-quaternary) var(--bg-primary);
  }
  *::-webkit-scrollbar {
    width: 0.5rem;
  }
  *::-webkit-scrollbar-track {
    background: var(--bg-primary);
  }
  *::-webkit-scrollbar-thumb {
    background-color: var(--text-quaternary);
  }

  html {
    display: flex;
    height: 100%;
    width: 100%;
    max-height: 100%;
    max-width: 100%;
    box-sizing: border-box;
    font-size: 1.25rem;
    line-height: ${theme.lineHeights.body};
    background-color: var(--bg-primary);
    color: var(--text-primary);
    padding: 0;
    margin: 0;
    -webkit-font-smoothing: antialiased;
    font-family: ${theme.fonts.body};
    -webkit-text-size-adjust: none;

    @media (max-width: ${theme.breakpoints[3]}) {
      font-size: 16px;
    }
  }

  body {
    margin: 0;
    width: 100%;
    height: 100%;
  }

  #__next {
    height: 100%;
  }

  a {
    color: currentColor;
    text-decoration: none;
    background-color: transparent;
  }

  a:hover {
    cursor: pointer;
  }

  a:hover button {
    text-decoration: none !important;
  }

  main {
    a:visited {
      color: var(--accent-purple);
    }
  }

  ::-moz-selection {
    /* Code for Firefox */
    background: var(--text-primary)!important;
    color: var(--text-on-primary)!important;
  }

  ::selection {
    background: var(--text-primary)!important;
    color: var(--text-on-primary)!important;
  }

  ::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: var(--text-placeholder);
  }

  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: var(--text-placeholder);
    opacity: 1;
  }

  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: var(--text-placeholder);
    opacity: 1;
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: var(--text-placeholder);
  }

  hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible;
  }

  abbr[title] {
    border-bottom: none;
    text-decoration: underline;
    text-decoration: underline dotted;
  }

  b,
  strong {
    font-weight: bolder;
  }

  code,
  kbd,
  samp {
    font-family: monospace, monospace;
  }

  small {
    font-size: 80%;
  }

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sub {
    bottom: -0.25em;
  }

  sup {
    top: -0.5em;
  }

  img {
    border-style: none;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.15;
    margin: 0;
  }

  button,
  input {
    overflow: visible;
  }

  button,
  select {
    text-transform: none;
  }

  button,
  [type="button"],
  [type="reset"],
  [type="submit"] {
    -webkit-appearance: button;
  }

  button::-moz-focus-inner,
  [type="button"]::-moz-focus-inner,
  [type="reset"]::-moz-focus-inner,
  [type="submit"]::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }

  button:-moz-focusring,
  [type="button"]:-moz-focusring,
  [type="reset"]:-moz-focusring,
  [type="submit"]:-moz-focusring {
    outline: 1px dotted ButtonText;
  }

  fieldset {
    padding: 0.35em 0.75em 0.625em;
  }

  legend {
    box-sizing: border-box;
    color: inherit;
    display: table;
    max-width: 100%;
    padding: 0;
    white-space: normal;
  }

  progress {
    vertical-align: baseline;
  }

  textarea {
    overflow: auto;
  }

  [type="checkbox"],
  [type="radio"] {
    box-sizing: border-box;
    padding: 0;
  }

  [type="number"]::-webkit-inner-spin-button,
  [type="number"]::-webkit-outer-spin-button {
    height: auto;
  }

  [type="search"] {
    -webkit-appearance: none;
    outline-offset: -2px;
  }

  [type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }

  details {
    display: block;
  }

  summary {
    display: list-item;
  }

  template {
    display: none;
  }

  [hidden] {
    display: none;
  }

  audio {
    display: block;
    margin-top: 16px;
    width: 100%;
  }
  
.body-page-transition {
    overflow: hidden;
}

.body-page-transition #page-transition {
    position: fixed;
    z-index: 9999;
    width: 100%;
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.body-page-transition #page-transition > div:after {
    content: "";
    position: fixed;
    z-index: 9998;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
.body-page-transition #page-transition > div:before {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    display: block;
    z-index: 9999;
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
}
`

export default ResetStyles
