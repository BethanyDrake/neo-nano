import { auth0 } from '@/lib/auth0'
import { ClientSideOnly } from '@/lib/ClientSideOnly'
import { ProfileContextProvider } from '@/lib/context/ProfileContext'
import { getMyGoals } from '@/lib/serverFunctions/goals/getMyGoals'
import { getMyProfile } from '@/lib/serverFunctions/profile/getMyProfile'
import { ProfilePageInner } from './ProfilePage'
import { ModalContextProvider } from '@/lib/modals/ModalContext'

const ProfilePage = async () => {
  const initalProfile = await getMyProfile()
  const initialGoals = await getMyGoals()

  return (
    <ClientSideOnly>
      <ModalContextProvider>
      <ProfileContextProvider initialProfile={initalProfile} initialGoals={initialGoals}>
        <ProfilePageInner />
      </ProfileContextProvider>
      </ModalContextProvider>
    </ClientSideOnly>
  )
}
export default auth0.withPageAuthRequired(ProfilePage, { returnTo: "/profile" }) as () => Promise<React.JSX.Element>

