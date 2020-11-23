import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'
import CopyToClipboard from 'react-copy-to-clipboard'
import SyntaxHighlighter from 'react-syntax-highlighter'
import * as ld from 'lodash'
import {
  FileCopy as CopyIcon,
  AssignmentTurnedIn as CheckIcon,
} from '@material-ui/icons'
// import {1
//   // sunburst as dark1,
//   atelierCaveDark as dark2,
//   xcode as light1,
//   tomorrow as light2,
// } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import theme from '~/components/Theme'

const colors = {
  hljs: {
    display: 'block',
    overflowX: 'auto',
    padding: '0.5em',
  },
  'hljs-emphasis': {
    color: 'var(--hljs-emphasis-fg)',
    backgroundColor: 'var(--hljs-emphasis-bg)',
  },
  'hljs-name': {
    color: 'var(--hljs-name-fg)',
    backgroundColor: 'var(--hljs-name-bg)',
  },
  'hljs-title': {
    color: 'var(--hljs-title-fg)',
    backgroundColor: 'var(--hljs-title-bg)',
  },
  'hljs-string': {
    color: 'var(--hljs-string-fg)',
    backgroundColor: 'var(--hljs-string-bg)',
  },
  'hljs-quote': {
    color: 'var(--hljs-quote-fg)',
    backgroundColor: 'var(--hljs-quote-bg)',
  },
  'hljs-type': {
    color: 'var(--hljs-type-fg)',
    backgroundColor: 'var(--hljs-type-bg)',
  },
  'hljs-attr': {
    color: 'var(--hljs-attr-fg)',
    backgroundColor: 'var(--hljs-attr-bg)',
  },
  'hljs-attribute': {
    color: 'var(--hljs-attribute-fg)',
    backgroundColor: 'var(--hljs-attribute-bg)',
  },
  'xml .hljs-meta': {
    color: 'var(--xml .hljs-meta-fg)',
    backgroundColor: 'var(--xml .hljs-meta-bg)',
  },
  'hljs-addition': {
    color: 'var(--hljs-addition-fg)',
    backgroundColor: 'var(--hljs-addition-bg)',
  },
  'hljs-meta-string': {
    color: 'var(--hljs-meta-string-fg)',
    backgroundColor: 'var(--hljs-meta-string-bg)',
  },
  'hljs-link': {
    color: 'var(--hljs-link-fg)',
    backgroundColor: 'var(--hljs-link-bg)',
  },
  'hljs-template-variable': {
    color: 'var(--hljs-template-variable-fg)',
    backgroundColor: 'var(--hljs-template-variable-bg)',
  },
  'hljs-bullet': {
    color: 'var(--hljs-bullet-fg)',
    backgroundColor: 'var(--hljs-bullet-bg)',
  },
  'hljs-class .hljs-title': {
    color: 'var(--hljs-class .hljs-title-fg)',
    backgroundColor: 'var(--hljs-class .hljs-title-bg)',
  },
  'hljs-formula': {
    color: 'var(--hljs-formula-fg)',
    backgroundColor: 'var(--hljs-formula-bg)',
  },
  'hljs-builtin-name': {
    color: 'var(--hljs-builtin-name-fg)',
    backgroundColor: 'var(--hljs-builtin-name-bg)',
  },
  'hljs-regexp': {
    color: 'var(--hljs-regexp-fg)',
    backgroundColor: 'var(--hljs-regexp-bg)',
  },
  'hljs-selector-tag': {
    color: 'var(--hljs-selector-tag-fg)',
    backgroundColor: 'var(--hljs-selector-tag-bg)',
  },
  'hljs-selector-class': {
    color: 'var(--hljs-selector-class-fg)',
    backgroundColor: 'var(--hljs-selector-class-bg)',
  },
  'hljs-comment': {
    color: 'var(--hljs-comment-fg)',
    backgroundColor: 'var(--hljs-comment-bg)',
  },
  'hljs-symbol': {
    color: 'var(--hljs-symbol-fg)',
    backgroundColor: 'var(--hljs-symbol-bg)',
  },
  'hljs-section': {
    color: 'var(--hljs-section-fg)',
    backgroundColor: 'var(--hljs-section-bg)',
  },
  'hljs-doctag': {
    color: 'var(--hljs-doctag-fg)',
    backgroundColor: 'var(--hljs-doctag-bg)',
  },
  'hljs-number': {
    color: 'var(--hljs-number-fg)',
    backgroundColor: 'var(--hljs-number-bg)',
  },
  'hljs-strong': {
    color: 'var(--hljs-strong-fg)',
    backgroundColor: 'var(--hljs-strong-bg)',
  },
  'hljs-keyword': {
    color: 'var(--hljs-keyword-fg)',
    backgroundColor: 'var(--hljs-keyword-bg)',
  },
  'hljs-literal': {
    color: 'var(--hljs-literal-fg)',
    backgroundColor: 'var(--hljs-literal-bg)',
  },
  'hljs-selector-id': {
    color: 'var(--hljs-selector-id-fg)',
    backgroundColor: 'var(--hljs-selector-id-bg)',
  },
  'hljs-code': {
    color: 'var(--hljs-code-fg)',
    backgroundColor: 'var(--hljs-code-bg)',
  },
  'hljs-meta': {
    color: 'var(--hljs-meta-fg)',
    backgroundColor: 'var(--hljs-meta-bg)',
  },
  'hljs-params': {
    color: 'var(--hljs-params-fg)',
    backgroundColor: 'var(--hljs-params-bg)',
  },
  'hljs-subst': {
    color: 'var(--hljs-subst-fg)',
    backgroundColor: 'var(--hljs-subst-bg)',
  },
  'hljs-built_in': {
    color: 'var(--hljs-built_in-fg)',
    backgroundColor: 'var(--hljs-built_in-bg)',
  },
  'hljs-variable': {
    color: 'var(--hljs-variable-fg)',
    backgroundColor: 'var(--hljs-variable-bg)',
  },
  'hljs-deletion': {
    color: 'var(--hljs-deletion-fg)',
    backgroundColor: 'var(--hljs-deletion-bg)',
  },
  'hljs-tag': {
    color: 'var(--hljs-tag-fg)',
    backgroundColor: 'var(--hljs-tag-bg)',
  },
}

const CopyToClipboardStyled = styled(CopyToClipboard)`
  position: absolute;
  right: 0;
  bottom: 0;
  opacity: 0.625;
  margin: 0.5em;
  padding: 0;
  cursor: pointer;
`

const Container = styled.div`
  width: auto;
  position: relative;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;

  @media (max-width: ${theme.breakpoints[4]}) {
    font-size: ${theme.fontSizes[0]};
  }
`

const MySyntaxHighlighter = styled(SyntaxHighlighter)`
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
`

interface Props {
  code: string
  language: string
  showCopyPaste?: boolean
  showLineNumbers?: boolean
  startingLineNumber?: number
  wrapLines?: boolean
}

export default function HighLight(props: Props): ReactElement {
  if (!ld.has(process, 'browser')) {
    return <></>
  }

  const {
    code,
    language,
    showCopyPaste,
    showLineNumbers,
    startingLineNumber,
    wrapLines,
  } = props

  const [copySuccess, setCopySuccess] = useState(false)

  function copyToClipboard() {
    setCopySuccess(true)
    setTimeout(() => {
      setCopySuccess(false)
    }, 250)
  }

  const copyPasteComponent = !showCopyPaste ? null : (
    <CopyToClipboardStyled text={code} onCopy={() => copyToClipboard()}>
      <button
        style={{ border: 'none', background: 'none' }}
        type="button"
        onClick={() => copyToClipboard()}
      >
        {copySuccess ? (
          <CheckIcon
            fontSize="inherit"
            style={{ color: 'var(--text-secondary)' }}
          />
        ) : (
          <CopyIcon
            fontSize="inherit"
            style={{ color: 'var(--text-secondary)' }}
          />
        )}
      </button>
    </CopyToClipboardStyled>
  )

  return (
    <Container>
      {copyPasteComponent}
      <MySyntaxHighlighter
        language={language}
        style={!copySuccess ? colors : colors}
        showLineNumbers={showLineNumbers}
        startingLineNumber={startingLineNumber}
        wrapLines={wrapLines}
      >
        {code}
      </MySyntaxHighlighter>
    </Container>
  )
}

HighLight.defaultProps = {
  showCopyPaste: true,
  showLineNumbers: true,
  startingLineNumber: 1,
  wrapLines: true,
}
