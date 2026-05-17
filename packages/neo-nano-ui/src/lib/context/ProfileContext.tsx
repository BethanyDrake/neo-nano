'use client'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'
import { Profile } from '@/lib/types/forum.types'
import { updateProfile as updateProfileServerSide } from '../serverFunctions/profile/updateProfile'
import { UserAward } from '@/lib/types/profile.types'
import { getMyAwards } from '../serverFunctions/profile/getMyAwards'
import { UseMutateFunction, useMutation, useQuery } from '@tanstack/react-query'
import { useUser } from '@auth0/nextjs-auth0'
import { getMyProfile } from '../serverFunctions/profile/getMyProfile'

const ProfileContext = createContext<{
  updateProfile: UseMutateFunction<Profile, Error, Pick<Profile, "displayName" | "aboutMe">>
  profile: Profile
  isLoading: boolean

  awards: UserAward[]
  refreshAwards: () => Promise<void>
}>({
  updateProfile: () => Promise.resolve(),
  profile: { id: '', displayName: '', role: 'user' },
  isLoading: false,
  awards: [],
  refreshAwards: () => Promise.resolve(),
})

export const useProfileContext = () => useContext(ProfileContext)

export const ProfileContextProvider = ({
  initialProfile,
  initialAwards,
  children,
}: PropsWithChildren & { initialProfile: Profile; initialAwards: UserAward[] }) => {
 
  const [awards, setAwards] = useState<UserAward[]>(initialAwards)
  const { user } = useUser()
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.sub],
    queryFn: async() => {
      const _profile = await getMyProfile()
      if (!_profile) throw Error("Missing profile.")
      return _profile
    }
      ,
    initialData: initialProfile,
    refetchOnMount: true,
    enabled: !!user?.sub
  })

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (newProfile: Pick<Profile, 'aboutMe' | 'displayName'>) => {
      const _profile = await updateProfileServerSide(newProfile)
      if (!_profile) throw Error("Missing profile.")
      return _profile
    },
    onSuccess: (data, _variables, _onMutateResult, context) => {
      context.client.setQueryData(['profile', user?.sub], data)
    },
  })

  const refreshAwards = useCallback(async () => {
    const newAwards = await getMyAwards()
    setAwards(newAwards)
  }, [])

  const value = useMemo(() => {
    return { isLoading, profile, updateProfile, awards, refreshAwards }
  }, [isLoading, profile, updateProfile, awards, refreshAwards])

  return <ProfileContext value={value}>{children}</ProfileContext>
}
