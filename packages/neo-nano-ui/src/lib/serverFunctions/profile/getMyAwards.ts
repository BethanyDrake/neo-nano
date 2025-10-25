'use server'
import camelcaseKeys from 'camelcase-keys'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import { UserAward } from '@/lib/profile.types'

export const getMyAwards = async () => {
  const sql = getQueryFunction()
  const userId = await getUserId()
  const user_awards = await sql`SELECT *
    FROM awards JOIN user_awards ON user_awards.award=awards.id
    WHERE awarded_to=${userId}
    ORDER BY awarded_at DESC`


  return camelcaseKeys(user_awards) as UserAward[]
}
