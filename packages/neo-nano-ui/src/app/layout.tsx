import type { Metadata } from 'next'
import '@/lib/globals.css'
import { auth0 } from '@/lib/auth0'
import { NavBar } from '@/lib/NavBar'
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
import { getIsModerator } from '@/lib/serverFunctions/moderation/getIsModerator';
import { SpeedInsights } from "@vercel/speed-insights/next"
config.autoAddCss = false;  
export const metadata: Metadata = {
  title: 'Novel November',
  description: 'Write a novel this November!',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth0.getSession()
  const isModerator = await getIsModerator()
  const isLoggedIn = !!session
  return (
    <html lang="en">
      <head/>

      <body>
        <NavBar isLoading={false} isLoggedIn={!!isLoggedIn} isModerator={isModerator} />
        <main>{children}</main>
        <SpeedInsights/>
      </body>
    </html>
  )
}
