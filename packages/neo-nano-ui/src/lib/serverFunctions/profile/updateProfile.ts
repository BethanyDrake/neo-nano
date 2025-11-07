'use server'

import { Profile } from "../../forum.types"
import { getMyProfile } from "./getMyProfile"
import { getQueryFunction } from "../_utils/getQueryFunction"
import { getExternalId } from "../_utils/getUserIdFromSession"

export const updateProfile = async (newProfile: Pick<Profile, 'aboutMe' | 'displayName'>)  => {
    const external_id = getExternalId()
    const sql = getQueryFunction()

    await sql`update users set display_name=${newProfile.displayName}, about_me=${newProfile.aboutMe}
    where external_id=${external_id}`

    return getMyProfile()
}
