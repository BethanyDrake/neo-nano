'use server'

import { getChallengeById } from '@/lib/challenges'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import { getMyGoals } from './getMyGoals'

export const joinChallenge = async (challengeId: string) => {
  const challenge = getChallengeById(challengeId)
  if (!challenge) {
    throw Error(`Challenge not found ${challengeId}`)
  }
  const {title, target, startDate: start_date, lengthDays: length_days, metric} = challenge
  const user_id = await getUserId()

  const records = new Array(length_days).fill(null)
  const sql = getQueryFunction()

  await sql`INSERT INTO goals (title, target, start_date, length_days, records, user_id, metric) 
        VALUES (${title}, ${target}, ${start_date}, ${length_days}, ${records}, ${user_id}, ${metric})`

  return await getMyGoals()
}
