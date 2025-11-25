'use client'

import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import { Profile } from "@/lib/types/forum.types"
import { getMyProfile } from "../serverFunctions/profile/getMyProfile"

export const UserContext = createContext<Pick<Profile, 'id' | 'role'> | null>(null)

export const UserContextProvider = ({children}: PropsWithChildren) => {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    getMyProfile().then(setProfile)
  },[])

    return <UserContext.Provider value={profile}>{children}</UserContext.Provider>
}

export const useIsLoggedIn = () => {
  const me = useContext(UserContext)
  return !!me
}

