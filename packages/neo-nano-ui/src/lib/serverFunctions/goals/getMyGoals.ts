'use server'
import camelcaseKeys from 'camelcase-keys'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import { Goal } from '@/lib/forum.types'

export const getMyGoals = async () => {
  const sql = getQueryFunction()
  const userId = await getUserId()
  const goals = await sql`SELECT id, title, target, start_date, length_days, records
    FROM goals
    WHERE user_id=${userId}
    ORDER BY start_date DESC`
  return camelcaseKeys(goals) as Goal[]
}
