'use server'
import camelcaseKeys from 'camelcase-keys'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { Goal } from '@/lib/forum.types'

export const getPublicGoals = async (userId: string) => {
  const sql = getQueryFunction()
  const goals = await sql`SELECT id, title, target, start_date, length_days, records
    FROM goals
    WHERE user_id=${userId}
    AND visibility='public'
    ORDER BY start_date DESC id ASC`
  return camelcaseKeys(goals) as Goal[]
}
