'use server'

import { auth0 } from "../../auth0"
import { Profile } from "../../forum.types"
import { getMyProfile } from "./getMyProfile"
import { getQueryFunction } from "../_utils/getQueryFunction"

export const updateProfile = async (newProfile: Pick<Profile, 'aboutMe' | 'displayName'>)  => {
    const session = await auth0.getSession()
    const external_id = session?.user.sub
    const sql = getQueryFunction()

    await sql`update users set display_name=${newProfile.displayName}, about_me=${newProfile.aboutMe}
    where external_id=${external_id}`

    return getMyProfile()
}
