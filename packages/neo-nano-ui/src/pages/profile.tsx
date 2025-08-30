import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { User } from '@auth0/nextjs-auth0/types'

export const ProfilePage = ({ user }: { user: User }) => {
  return (
    <>
      <h1>My Profile</h1>
      <p>{user.name}</p>
    </>
  )
}

const ProtectedProfilePage = withPageAuthRequired(ProfilePage)

export default ProtectedProfilePage
