"use client"
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";
import { Profile } from "./forum.types";
import { updateProfile as updateProfileServerSide } from "./serverFunctions/profile/updateProfile";

const ProfileContext = createContext<
{
    updateProfile: (newProfile: Pick<Profile, 'aboutMe' | 'displayName'>) => Promise<void>
    profile: Profile
    isLoading: boolean
}>({
    updateProfile: () => Promise.resolve(),
    profile: {id: '', displayName: ''},
    isLoading: false
})

export const useProfileContext = () => useContext(ProfileContext)

export const ProfileContextProvider = ({initialProfile, children}: PropsWithChildren & {initialProfile: Profile}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [profile, setProfile] = useState(initialProfile)

    const updateProfile = useCallback((newProfile: Pick<Profile, 'aboutMe' | 'displayName'>) => {
        setIsLoading(true)
        return updateProfileServerSide(newProfile)
            .then(setProfile)
            .then(() => setIsLoading(false))
    }, [])

    const value = useMemo(() => {
        return {isLoading, profile, updateProfile}
    }, [isLoading, profile, updateProfile])

    return (<ProfileContext value={value}>{children}</ProfileContext>)


}