import { auth0 } from '@/lib/auth0'
import { ProfileContextProvider } from '@/lib/context/ProfileContext'
import { getMyProfile } from '@/lib/serverFunctions/profile/getMyProfile'
import { ProfilePageInner } from './ProfilePage'
import { getMyAwards } from '@/lib/serverFunctions/profile/getMyAwards'
import { NewAwardModalProvider } from '@/lib/awards/NewAwardModal'
import { MyGoalContextProvider } from '@/lib/context/MyGoalsContext'

const ProfilePage = async () => {
  const [initalProfile, initialAwards] = await Promise.all([getMyProfile(), getMyAwards()])
  if (!initalProfile) throw Error('No profile found for ProfilePage.')

  return (
      <NewAwardModalProvider>
          <ProfileContextProvider initialProfile={initalProfile} initialAwards={initialAwards}>
            <MyGoalContextProvider>
              <ProfilePageInner />
            </MyGoalContextProvider>
          </ProfileContextProvider>
      </NewAwardModalProvider>
  )
}
export default auth0.withPageAuthRequired(ProfilePage, { returnTo: '/profile' }) as () => Promise<React.JSX.Element>
