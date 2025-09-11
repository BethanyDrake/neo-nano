import type { Metadata } from 'next'
import '@/lib/globals.css'
import { auth0 } from '@/lib/auth0'
import { NavBar } from '@/lib/NavBar'

export const metadata: Metadata = {
  title: 'Neo Nano',
  description: 'Write a novel this November!',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth0.getSession()
  const isLoggedIn = !!session
  return (
    <html lang="en">
      <body>
        <NavBar isLoading={false} isLoggedIn={!!isLoggedIn} />
        <main>{children}</main>
      </body>
    </html>
  )
}
