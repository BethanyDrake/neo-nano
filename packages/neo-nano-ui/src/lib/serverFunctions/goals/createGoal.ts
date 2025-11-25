'use server'

import { Goal } from '@/lib/types/forum.types'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import { getMyGoals } from './getMyGoals'

export const createGoal = async ({title, target, lengthDays, startDate, metric}: Pick<Goal, 'title' | 'target' | 'lengthDays' | 'startDate'| 'metric' >) => {
  console.log('create goal')
  const user_id = await getUserId()
  const records = new Array(lengthDays).fill(null)
  const sql = getQueryFunction()

  await sql`INSERT INTO goals (title, target, start_date, length_days, records, user_id, metric) 
        VALUES (${title}, ${target}, ${startDate}, ${lengthDays}, ${records}, ${user_id}, ${metric})`

  return await getMyGoals()
}
