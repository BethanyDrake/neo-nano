'use server'
import { UserAward } from '@/lib/types/profile.types'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getSingle } from '../_utils/getSingle'
import { getUserId } from '../_utils/getUserIdFromSession'
import camelcaseKeys from 'camelcase-keys'

export const claimAward = async (awardId: string) => {
  console.log('claimAward', awardId)
  const sql = getQueryFunction()
  const userId = await getUserId()
  await sql`INSERT into user_awards (awarded_to, award) 
  values (${userId}, ${awardId})`

  const claimed_award = await getSingle(
    'ClaimedAward',
    sql`SELECT awards.*, user_awards.awarded_to, user_awards.awarded_at
      FROM awards JOIN user_awards ON user_awards.award=awards.id
      WHERE awarded_to=${userId}
      and awards.id=${awardId}
    `,
  )

  return camelcaseKeys(claimed_award) as UserAward
}
