'use server'
import { Goal } from '@/lib/types/forum.types'
import camelcaseKeys from 'camelcase-keys'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getExternalId } from '../_utils/getUserIdFromSession'
import { isActive } from './goalUtils'

export const getActiveGoal = async (date: string) => {
  console.log('getActiveGoal', date)
  const sql = getQueryFunction()
  const external_id = await getExternalId()
  const startedGoals = await sql`SELECT goals.*
    FROM goals
    join users on users.id=goals.user_id
    WHERE users.external_id=${external_id} and start_date <= ${date}
    ORDER BY start_date DESC, id ASC`

  const activeGoals = startedGoals.filter(({ start_date, length_days }) => isActive(start_date, length_days, date))
  if (activeGoals.length === 0) return null

  return camelcaseKeys(activeGoals[0]) as Goal
}
