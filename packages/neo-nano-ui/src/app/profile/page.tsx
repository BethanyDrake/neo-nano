
import { ProfilePageInner } from "./ProfilePage"
import { auth0 } from "@/lib/auth0"
import { getMyProfile } from '@/app/api/profile/route'
import { redirect } from 'next/navigation'

const ProfilePage = async () => {

    const session = await auth0.getSession()
    if(!session) {
      return redirect(`${process.env.APP_BASE_URL}/auth/login`)
    }
    const initalProfile = await getMyProfile()

  return <><div>ProfilePage</div><ProfilePageInner initalProfile={initalProfile}/></>
}


export default ProfilePage
