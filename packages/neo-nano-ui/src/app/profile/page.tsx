import { getMyProfile } from '@/lib/serverFunctions/profile/getMyProfile'
import { ProfilePageInner } from './ProfilePage'
import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'
import { ProfileContextProvider } from '@/lib/context/ProfileContext'

const ProfilePage = async () => {
  const session = await auth0.getSession()
  if (!session) {
    return redirect(`${process.env.APP_BASE_URL}/auth/login`)
  }
  const initalProfile = await getMyProfile()

  return (
    <ProfileContextProvider initialProfile={initalProfile}>
      <ProfilePageInner />
    </ProfileContextProvider>
  )
}

export default ProfilePage
