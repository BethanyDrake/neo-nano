import { useUser } from "@auth0/nextjs-auth0"
import { usePathname, redirect } from "next/navigation"

export const useRequireLogin = () => {
  const { user, isLoading } = useUser()
  const pathname = usePathname()

  if (!isLoading && !user) {
    console.warn('useRequireLogin: redirecting to login')
    redirect(`/auth/login?returnTo=${pathname}`)
  }
}