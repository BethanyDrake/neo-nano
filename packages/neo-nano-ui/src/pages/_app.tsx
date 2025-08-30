import { NavBar } from '@/lib/NavBar'
import type { AppProps } from 'next/app'
import '@/lib/globals.css'
import { useUser } from '@auth0/nextjs-auth0'

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
