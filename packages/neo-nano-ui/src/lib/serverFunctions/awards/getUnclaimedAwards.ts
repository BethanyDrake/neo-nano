'use server'
import { Award } from '@/lib/profile.types'
import { getQueryFunction } from '../_utils/getQueryFunction'
import camelcaseKeys from 'camelcase-keys'

export async function getUnclaimedAwards(user_id: string): Promise<Award[]> {
  const sql = getQueryFunction()

  const awards = await sql`SELECT * from awards
LEFT JOIN user_awards ON awards.id = user_awards.award AND user_awards.awarded_to = ${user_id}
where awarded_to is NULL`

  return awards.map((award) => camelcaseKeys(award) as Award)
}
