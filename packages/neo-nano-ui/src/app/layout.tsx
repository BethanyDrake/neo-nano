import { NavBar } from '@/lib/navbar/NavBar'
import '@/lib/styles/globals.css'
import type { Metadata } from 'next'

import { ModalContextProvider } from '@/lib/modals/ModalContext'
import { config } from '@fortawesome/fontawesome-svg-core'
import { GoogleTagManager } from '@next/third-parties/google'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import navBarStyles from '@/lib/navbar/NavBar.module.css'

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css'
import Providers from './providers'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// Prevent fontawesome from adding its CSS since we did it manually above:
config.autoAddCss = false
export const metadata: Metadata = {
  title: 'Novel November',
  description: 'Write a novel this November!',
  openGraph: {
    title: 'Write a novel this November!',
    description: '30 days, 50K words. Can you beat the challenge?',
    url: 'https://www.novel-november.com',
    siteName: 'Novel November',
    images: [{ url: 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/opengraph-image.png' }],
  },
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
      const queryClient = new QueryClient()
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-KRXL28V4" />

      <body>
        <Providers>
        <HydrationBoundary state={dehydrate(queryClient)}>
        <NavBar/>
        <ModalContextProvider>
          <NavBar />
          <div className={navBarStyles.belowNav}>
          {children}
          </div>
        </ModalContextProvider>
        <ReactQueryDevtools/>
        </HydrationBoundary>
        </Providers>
        <SpeedInsights />
        <Analytics />
 
      </body>
    </html>
  )
}
