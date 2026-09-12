'use server'

import { Profile } from '@/lib/types/forum.types'
import { getMyProfile } from './getMyProfile'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getExternalId } from '../_utils/getUserIdFromSession'

export const updateProfile = async (newProfile: Pick<Profile, 'aboutMe' | 'displayName' | 'links'>) => {
  const external_id = await getExternalId()

  const response =
    await getQueryFunction()`update users set display_name=${newProfile.displayName}, about_me=${newProfile.aboutMe}
    where external_id=${external_id}
    returning users.id as updated_user_id
`

  if (response.length !== 1) {
    throw Error(`Failed to update profile`)
  }

  const { ao3, wattpad, substack, bluesky } = newProfile.links
  await getQueryFunction()`
    INSERT INTO profile_links (user_id, ao3, wattpad, substack, bluesky) 
    VALUES (${response[0].updated_user_id}, ${ao3}, ${wattpad}, ${substack}, ${bluesky})
    ON CONFLICT(user_id) DO UPDATE set 
        ao3=${ao3},
        wattpad=${wattpad},
        substack=${substack},
        bluesky=${bluesky}
    returning *
`

  return getMyProfile()
}
