import { useUser } from "@auth0/nextjs-auth0"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"

export const useRequireLogin = () => {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  if (!isLoading && !user) {
    router.push(`/auth/login?returnTo=${pathname}`)
  }
}