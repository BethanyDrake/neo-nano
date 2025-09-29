import { auth0 } from '@/lib/auth0'
import { ClientSideOnly } from '@/lib/ClientSideOnly'
import { ProfileContextProvider } from '@/lib/context/ProfileContext'
import { getMyGoals } from '@/lib/serverFunctions/goals/getMyGoals'
import { getMyProfile } from '@/lib/serverFunctions/profile/getMyProfile'
import { redirect } from 'next/navigation'
import { ProfilePageInner } from './ProfilePage'

const ProfilePage = async () => {
  const session = await auth0.getSession()
  if (!session) {
    return redirect(`${process.env.APP_BASE_URL}/auth/login?returnTo=${process.env.APP_BASE_URL}/profile`)
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
