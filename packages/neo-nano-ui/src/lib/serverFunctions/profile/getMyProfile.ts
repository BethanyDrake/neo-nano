'use server'
import { auth0 } from '@/lib/auth0'
import { Profile } from '@/lib/forum.types'
import camelcaseKeys from 'camelcase-keys'
import { getSingle } from '../_utils/getSingle'
import { getQueryFunction } from '../_utils/getQueryFunction'

export const getMyProfile = async (): Promise<Profile> => {
  await auth0.getAccessToken()
  const session = await auth0.getSession()
  const sql = getQueryFunction()
  const external_id = session?.user.sub

  const myProfile = await getSingle(
    'user',
    sql`SELECT id, display_name, about_me, role FROM users 
    WHERE external_id=${external_id}
    LIMIT 1`,
  )

  return camelcaseKeys(myProfile) as Profile
}
