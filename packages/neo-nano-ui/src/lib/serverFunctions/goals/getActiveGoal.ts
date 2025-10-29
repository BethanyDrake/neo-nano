'use server'
import { Goal } from '@/lib/forum.types'
import camelcaseKeys from 'camelcase-keys'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import { isActive } from './goalUtils'

export const getActiveGoal = async (date: string) => {
  console.log('getActiveGoal', date)
  const sql = getQueryFunction()
  const userId = await getUserId()
  const startedGoals = await sql`SELECT id, title, target, start_date, length_days, records, visibility
    FROM goals
    WHERE user_id=${userId} and start_date <= ${date}
    ORDER BY start_date DESC, id ASC`

  const activeGoals = startedGoals.filter(({ start_date, length_days }) => isActive(start_date, length_days, date))
  if (activeGoals.length === 0) return null

  return camelcaseKeys(activeGoals[0]) as Goal
}
