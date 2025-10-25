'use server'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import { getMyAwards } from './getMyAwards'

export const claimAward = async (awardId: string) => {
  const sql = getQueryFunction()
  const userId = await getUserId()
  await sql`INSERT into user_awards (awarded_to, award) 
  values (${userId}, ${awardId})`

  return getMyAwards()
}
