import * as React from 'react'
import Link from 'next/link'
import Head from 'next/head'

type Props = {
  title?: string
}

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'NextJS',
}) => (
  <div className="h-screen">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header className="h-12 flex items-center p-5">
      <nav className="flex justify-between w-full">
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/weather">
          <a>Weather</a>
        </Link>
      </nav>
    </header>
    <div className="app">
      {children}
    </div>
    <footer className="sticky bottom-0 bg-gray-300">
      <div className="app">
        <span>I'm here to stay (Footer)</span>
      </div>
    </footer>
  </div>
)

export default Layout
