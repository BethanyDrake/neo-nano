'use server'

import { Profile } from "@/lib/types/forum.types"
import { getMyProfile } from "./getMyProfile"
import { getQueryFunction } from "../_utils/getQueryFunction"
import { getExternalId } from "../_utils/getUserIdFromSession"

export const updateProfile = async (newProfile: Pick<Profile, 'aboutMe' | 'displayName'>)  => {
     
    const external_id = await getExternalId()
    const sql = getQueryFunction()

    const response = await sql`update users set display_name=${newProfile.displayName}, about_me=${newProfile.aboutMe}
    where external_id=${external_id}
    returning users.id as updated_user_id
`
    if (response.length !== 1) {
        throw Error(`Failed to update profile`)
    }

    return getMyProfile()
}
