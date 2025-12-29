'use server'
import camelcaseKeys from 'camelcase-keys'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { UserAward } from '@/lib/types/profile.types'

export const getPublicAwards = async (userId: string) => {
  console.log('getPublicAwards')
  const sql = getQueryFunction()
  const user_awards = await sql`SELECT awards.*, user_awards.*
    FROM awards JOIN user_awards ON user_awards.award=awards.id
    WHERE user_awards.awarded_to=${userId}
    ORDER BY awarded_at DESC`

  return camelcaseKeys(user_awards) as UserAward[]
}
