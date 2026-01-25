import { useUser } from "@auth0/nextjs-auth0";

export const useIsLoggedIn = () => {
  const {user} = useUser() 

  return !!user
}
