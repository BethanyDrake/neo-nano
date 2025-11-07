'use server'
import camelcaseKeys from 'camelcase-keys'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getExternalId } from '../_utils/getUserIdFromSession'
import { UserAward } from '@/lib/profile.types'

export const getMyAwards = async () => {
  console.log('getMyAwards')
  const sql = getQueryFunction()
  const external_id = await getExternalId()
  const user_awards = await sql`SELECT awards.*, user_awards.*
    FROM awards JOIN user_awards ON user_awards.award=awards.id
    join users on users.id=user_awards.awarded_to
    WHERE users.external_id=${external_id}
    ORDER BY awarded_at DESC`

  return camelcaseKeys(user_awards) as UserAward[]
}
