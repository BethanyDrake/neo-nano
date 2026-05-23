import { auth0 } from '@/lib/auth0'
import { ProfileContextProvider } from '@/lib/context/ProfileContext'
import { getMyProfile } from '@/lib/serverFunctions/profile/getMyProfile'
import { ProfilePageInner } from './ProfilePage'
import { getMyAwards } from '@/lib/serverFunctions/profile/getMyAwards'
import { Metadata } from 'next'
import { MyProjectsContextProvider } from '@/lib/projects/MyProjectContext'

export const metadata: Metadata = {
  title: 'My Profile',
}
const ProfilePage = async () => {
  
  const [initalProfile, initialAwards] = await Promise.all([getMyProfile(), getMyAwards()])
  if (!initalProfile) throw Error('No profile found for ProfilePage.')

  return (
          <ProfileContextProvider initialProfile={initalProfile} initialAwards={initialAwards}>
              <MyProjectsContextProvider>
              <ProfilePageInner />
              </MyProjectsContextProvider>
          </ProfileContextProvider>
  )
}
export default auth0.withPageAuthRequired(ProfilePage, { returnTo: '/profile' }) as () => Promise<React.JSX.Element>
