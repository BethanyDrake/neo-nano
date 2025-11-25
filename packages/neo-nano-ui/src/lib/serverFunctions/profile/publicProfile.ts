'use server'
import { Profile } from '@/lib/types/forum.types'
import camelcaseKeys from 'camelcase-keys'
import { getSingle } from '../_utils/getSingle'
import { getQueryFunction } from '../_utils/getQueryFunction'

export const getPublicProfile = async (userId: string): Promise<Profile> => {
  console.log('getPublicProfile')
  const sql = getQueryFunction()
  const myProfile = await getSingle(
    'user',
    sql`SELECT id, display_name, about_me, role FROM users 
    WHERE id=${userId}
    LIMIT 1`,
  )

  return camelcaseKeys(myProfile) as Profile
}