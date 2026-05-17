'use client'

import { createContext, PropsWithChildren} from "react"
import { Profile } from "@/lib/types/forum.types"
import { getMyProfile } from "../serverFunctions/profile/getMyProfile"
import { useUser } from "@auth0/nextjs-auth0"
import { useQuery } from "@tanstack/react-query"

export const UserContext = createContext<Pick<Profile, 'id' | 'role'> | null | undefined>(null)

export const UserContextProvider = ({children}: PropsWithChildren) => {
   const { user } = useUser()
    const { data: profile } = useQuery({
    queryKey: ['user', user?.sub],
    queryFn: () => getMyProfile(),
  })

    return <UserContext.Provider value={profile}>{children}</UserContext.Provider>
}

