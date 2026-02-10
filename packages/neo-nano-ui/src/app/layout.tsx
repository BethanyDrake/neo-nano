import { NavBar } from '@/lib/navbar/NavBar'
import '@/lib/styles/globals.css'
import type { Metadata } from 'next'

import { ModalContextProvider } from '@/lib/modals/ModalContext'
import { config } from '@fortawesome/fontawesome-svg-core'
import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import navBarStyles from '@/lib/navbar/NavBar.module.css'

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css'
import ReactQueryProvider from './providers'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { auth0 } from '@/lib/auth0'
import { AuthContextProvider } from '@/lib/hooks/useIsLoggedIn'
import { ActiveGoalProvider } from '@/lib/goalTracker/quickUpdate/ActiveGoalContext'
// Prevent fontawesome from adding its CSS since we did it manually above:
config.autoAddCss = false
export const metadata: Metadata = {
  title: {
    template: '%s | Novel November',
    default: 'Novel November',
  },
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
  const session = await auth0.getSession()

  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-KRXL28V4" />
      <body>
        <AuthContextProvider session={session}>
          <ReactQueryProvider>
            <ActiveGoalProvider>
              <ModalContextProvider>
                <NavBar />
                <div className={navBarStyles.belowNav}>{children}</div>
              </ModalContextProvider>
            </ActiveGoalProvider>
            <ReactQueryDevtools />
          </ReactQueryProvider>
        </AuthContextProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
