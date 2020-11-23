import * as React from 'react'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { ReactElement } from 'react'

const SeoConfig = {
  title: 'hubshuffle',
  description: 'hubshuffle blog',
  openGraph: {
    title: 'hubshuffle  ¦̵̱ ̵̱ ̵̱ ̵̱ ̵̱(̢ ̡͇̅└͇̅┘͇̅ (▤8כ−◦',
    url: 'https://hubshuffle.com',
    description: 'hubshuffle - Sharing Ideas.',
    canonical: 'https://hubshuffle.com',
    type: 'website',
    locale: 'en_GB',
    site_name: 'hubshuffle',
    images: [
      {
        url: 'https://hubshuffle.com/static/meta/og-image.png',
        alt: 'hubshuffle logo',
      },
    ],
  },
  twitter: {
    handle: '@hubshuffle',
    site: '@hubshuffle',
    cardType: 'summary_large_image',
  },
}

export default function SEO(): ReactElement {
  return (
    <React.Fragment>
      <DefaultSeo {...SeoConfig} />
      <Head>
        <meta name="theme-color" content={'#fefefe'} />
        <link rel="apple-touch-icon" href="/public/images/icon.png" />
        <link rel="android-touch-icon" href="/public/images/icon.png" />
        <link
          rel="mask-icon"
          href="/public/images/icon.png"
          color={'#050505'}
        />
        <link rel="manifest" href="/public/meta/manifest.json" />
        <link rel="icon" href="/public/favicon.ico" />
      </Head>
    </React.Fragment>
  )
}
