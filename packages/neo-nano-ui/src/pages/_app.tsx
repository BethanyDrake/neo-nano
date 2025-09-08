import { NavBar } from '@/lib/NavBar'
import type { AppProps } from 'next/app'
import '@/lib/globals.css'
import { useUser } from '@auth0/nextjs-auth0'
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;  

export default function MyApp({ Component, pageProps }: AppProps) {
  const { user, isLoading } = useUser()
  return (
    <>
      <NavBar isLoading={isLoading} isLoggedIn={!!user} />
      <main>
      <Component {...pageProps} />
      </main>
    </>
  )
}
