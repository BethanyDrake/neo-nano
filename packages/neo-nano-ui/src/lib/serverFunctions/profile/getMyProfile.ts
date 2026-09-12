'use server'
import { Profile } from '@/lib/types/forum.types'
import camelcaseKeys from 'camelcase-keys'
import { getSingle } from '../_utils/getSingle'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getExternalId } from '../_utils/getUserIdFromSession'

export const getMyProfile = async (): Promise<Profile | null> => {
  console.log("getMyProfile")
  const external_id = await getExternalId()

  const myProfile = await getSingle(
    'user',
    getQueryFunction()`SELECT id, display_name, about_me, role FROM users 
    WHERE external_id=${external_id}
    LIMIT 1`,
  )

  console.log(myProfile)
  const _links = await getQueryFunction()`SELECT * FROM profile_links
    WHERE user_id=${myProfile.id}
    LIMIT 1`

  const links = _links.length > 0 ? _links[0]: {}
  delete links.user_id

  return {
    ...camelcaseKeys(myProfile),
    links
  } as Profile
}
