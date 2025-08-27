import { NavBar } from '@/lib/NavBar'
import type { AppProps } from 'next/app'
import '@/lib/globals.css'
 
export default function MyApp({ Component, pageProps }: AppProps) {
  return <><NavBar/><Component {...pageProps} /></> 
}