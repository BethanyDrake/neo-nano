import '@/lib/styles/globals.css'
import { NavBar } from '@/lib/navbar/NavBar'
import type { Metadata } from 'next'
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css'
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
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
  return (
    <html lang="en">
      <head />

      <body>
        <NavBar/>
        <main>{children}</main>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
