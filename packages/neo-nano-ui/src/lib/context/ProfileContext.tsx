'use client'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'
import { Goal, Profile } from '../forum.types'
import { updateProfile as updateProfileServerSide } from '../serverFunctions/profile/updateProfile'
import { UserAward } from '../profile.types'
import { getMyAwards } from '../serverFunctions/profile/getMyAwards'

const ProfileContext = createContext<{
  updateProfile: (newProfile: Pick<Profile, 'aboutMe' | 'displayName'>) => Promise<void>
  profile: Profile
  isLoading: boolean
  goals: Goal[]
  setGoals: (goals: Goal[]) => void
  awards: UserAward[]
  refreshAwards: () => Promise<void>
}>({
  updateProfile: () => Promise.resolve(),
  profile: { id: '', displayName: '', role: 'user' },
  isLoading: false,
  goals: [],
  setGoals: () => Promise.resolve(),
  awards: [],
  refreshAwards: () => Promise.resolve()
})

export const useProfileContext = () => useContext(ProfileContext)

export const ProfileContextProvider = ({
  initialProfile,
  initialGoals,
  initialAwards,
  children,
}: PropsWithChildren & { initialProfile: Profile; initialGoals: Goal[], initialAwards: UserAward[] }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState(initialProfile)
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
   const [awards, setAwards] = useState<UserAward[]>(initialAwards)

  const updateProfile = useCallback((newProfile: Pick<Profile, 'aboutMe' | 'displayName'>) => {
    setIsLoading(true)
    return updateProfileServerSide(newProfile)
      .then(setProfile)
      .then(() => setIsLoading(false))
  }, [])

  const refreshAwards = useCallback(async () => {
    const newAwards = await getMyAwards()
    setAwards(newAwards)
  }, [])

  const value = useMemo(() => {
    return { isLoading, profile, updateProfile, goals, setGoals, awards, refreshAwards }
  }, [isLoading, profile, updateProfile, goals, setGoals, awards, refreshAwards])

  return <ProfileContext value={value}>{children}</ProfileContext>
}
