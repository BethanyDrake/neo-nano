'use client'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'
import { Profile } from '@/lib/types/forum.types'
import { updateProfile as updateProfileServerSide } from '../serverFunctions/profile/updateProfile'
import { UserAward } from '@/lib/types/profile.types'
import { getMyAwards } from '../serverFunctions/profile/getMyAwards'

const ProfileContext = createContext<{
  updateProfile: (newProfile: Pick<Profile, 'aboutMe' | 'displayName'>) => Promise<void>
  profile: Profile
  isLoading: boolean

  awards: UserAward[]
  refreshAwards: () => Promise<void>
}>({
  updateProfile: () => Promise.resolve(),
  profile: { id: '', displayName: '', role: 'user' },
  isLoading: false,
  awards: [],
  refreshAwards: () => Promise.resolve()
})

export const useProfileContext = () => useContext(ProfileContext)

export const ProfileContextProvider = ({
  initialProfile,
  initialAwards,
  children,
}: PropsWithChildren & { initialProfile: Profile; initialAwards: UserAward[] }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState(initialProfile)
   const [awards, setAwards] = useState<UserAward[]>(initialAwards)

  const updateProfile = useCallback((newProfile: Pick<Profile, 'aboutMe' | 'displayName'>) => {
    setIsLoading(true)
    return updateProfileServerSide(newProfile)
      .then((updatedProfile) => updatedProfile && setProfile(updatedProfile))
      .then(() => setIsLoading(false))
  }, [])

  const refreshAwards = useCallback(async () => {
    const newAwards = await getMyAwards()
    setAwards(newAwards)
  }, [])

  const value = useMemo(() => {
    return { isLoading, profile, updateProfile,  awards, refreshAwards }
  }, [isLoading, profile, updateProfile, awards, refreshAwards])

  return <ProfileContext value={value}>{children}</ProfileContext>
}
