import * as React from 'react'
//import Link from 'next/link'
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
    { /*
    <header className="h-12 flex items-center p-5 app">
      <nav className="flex justify-between w-full">
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/weather">
          <a>Weather</a>
        </Link>
      </nav>
    </header>
    */ }
    <div>
      {children}
    </div>
    <footer id="footer">
      <div className="body flex items-center justify-center z-10">
        <div className="app flex flex-col items-center justify-center font-mono">
          <div className="flex justify-between">
            <a href="https://twitter.com/_lomz_" target="_blank">
              <img className="mx-1" src="/images/Twitter-Logo.svg" />
            </a>
            <a href="https://linkedin.com/in/jack-michaud/" target="_blank">
              <img className="mx-1" src="/images/LinkedIn-Logo.svg" />
            </a>
          </div>
          Jack Michaud { new Date().getFullYear() }<br/>
          <div>
            Icons by <a href="https://fontawesome.com/">Font Awesome</a><br/>
          </div>
        </div>
      </div>
      <img src="/images/Ellipse.svg" className="ellipse z-0"/>
    </footer>
  </div>
)

export default Layout
