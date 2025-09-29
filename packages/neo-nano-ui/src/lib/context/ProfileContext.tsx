'use client'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'
import { Goal, Profile } from '../forum.types'
import { updateProfile as updateProfileServerSide } from '../serverFunctions/profile/updateProfile'

const ProfileContext = createContext<{
  updateProfile: (newProfile: Pick<Profile, 'aboutMe' | 'displayName'>) => Promise<void>
  profile: Profile
  isLoading: boolean
  goals: Goal[]
  setGoals: (goals: Goal[]) => void
}>({
  updateProfile: () => Promise.resolve(),
  profile: { id: '', displayName: '' },
  isLoading: false,
  goals: [],
  setGoals: () => Promise.resolve(),
})

export const useProfileContext = () => useContext(ProfileContext)

export const ProfileContextProvider = ({
  initialProfile,
  initialGoals,
  children,
}: PropsWithChildren & { initialProfile: Profile; initialGoals: Goal[] }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState(initialProfile)
  const [goals, setGoals] = useState<Goal[]>(initialGoals)

  const updateProfile = useCallback((newProfile: Pick<Profile, 'aboutMe' | 'displayName'>) => {
    setIsLoading(true)
    return updateProfileServerSide(newProfile)
      .then(setProfile)
      .then(() => setIsLoading(false))
  }, [])

  const value = useMemo(() => {
    return { isLoading, profile, updateProfile, goals, setGoals }
  }, [isLoading, profile, updateProfile, goals, setGoals])

  return <ProfileContext value={value}>{children}</ProfileContext>
}
