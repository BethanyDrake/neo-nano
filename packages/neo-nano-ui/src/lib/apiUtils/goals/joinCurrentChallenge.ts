'use server'

import { getQueryFunction } from '../getQueryFunction'
import { getUserId } from '../getUserIdFromSession'
import { getMyGoals } from './getMyGoals'

export const joinCurrentChallenge = async () => {
  const title = 'November 2025'
  const user_id = await getUserId()
  const target = 50000
  const length_days = 30
  const start_date = '2025-11-01'
  const records = new Array(30).fill(null)
  const sql = getQueryFunction()

  await sql`INSERT INTO goals (title, target, start_date, length_days, records, user_id) 
        VALUES (${title}, ${target}, ${start_date}, ${length_days}, ${records}, ${user_id})`

  return await getMyGoals()
}
