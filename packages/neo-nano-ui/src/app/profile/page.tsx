import { getMyProfile } from '@/lib/serverFunctions/profile/getMyProfile'
import { ProfilePageInner } from './ProfilePage'
import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'
import { ProfileContextProvider } from '@/lib/context/ProfileContext'
import { getMyGoals } from '@/lib/serverFunctions/goals/getMyGoals'
import { ClientSideOnly } from '@/lib/ClientSideOnly'

const ProfilePage = async () => {
  const session = await auth0.getSession()
  if (!session) {
    return redirect(`${process.env.APP_BASE_URL}/auth/login`)
  }
  const initalProfile = await getMyProfile()
  const initialGoals = await getMyGoals()

  return (
    <ClientSideOnly>
    <ProfileContextProvider initialProfile={initalProfile} initialGoals={initialGoals}>
      <ProfilePageInner />
    </ProfileContextProvider>
    </ClientSideOnly>
  )
}

export default ProfilePage
