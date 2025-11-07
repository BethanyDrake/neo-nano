'use server'

import { Goal } from '@/lib/forum.types'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import { getMyGoals } from './getMyGoals'

export const createGoal = async ({title, target, lengthDays, startDate}: Pick<Goal, 'title' | 'target' | 'lengthDays' | 'startDate'>) => {
  console.log('create goal')
  const user_id = await getUserId()
  const records = new Array(lengthDays).fill(null)
  const sql = getQueryFunction()

  await sql`INSERT INTO goals (title, target, start_date, length_days, records, user_id) 
        VALUES (${title}, ${target}, ${startDate}, ${lengthDays}, ${records}, ${user_id})`

  return await getMyGoals()
}
