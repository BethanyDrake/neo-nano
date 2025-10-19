import { useUser } from "@auth0/nextjs-auth0"
import { usePathname, useRouter } from "next/navigation"

export const useRequireLogin = () => {
  const { user, isLoading } = useUser()
  const pathname = usePathname()
  console.log("useRequireLogin", pathname)

  const router = useRouter()
  if (!isLoading && !user) {
    console.warn('useRequireLogin: redirecting to login')
    router.push(`/auth/login?returnTo=${pathname}`)
  }
}