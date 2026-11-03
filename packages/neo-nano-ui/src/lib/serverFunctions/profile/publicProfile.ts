'use server'
import { Profile } from '@/lib/types/forum.types'
import camelcaseKeys from 'camelcase-keys'
import { getSingle } from '../_utils/getSingle'
import { getQueryFunction } from '../_utils/getQueryFunction'

export const getPublicProfile = async (userId: string): Promise<Profile | undefined> => {
  console.log('getPublicProfile')
  const sql = getQueryFunction()
  try {
    const myProfile = await getSingle(
      'user',
      sql`SELECT id, display_name, about_me, role FROM users 
    WHERE id=${userId}
    AND NOT role='deleted'
    LIMIT 1`,
    )
    return camelcaseKeys(myProfile) as Profile
  } catch (error) {
    console.error(error)
    return undefined
  }
}
