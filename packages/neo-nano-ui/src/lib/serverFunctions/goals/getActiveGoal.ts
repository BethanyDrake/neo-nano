'use server'
import { Goal } from '@/lib/types/forum.types'
import camelcaseKeys from 'camelcase-keys'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getExternalId } from '../_utils/getUserIdFromSession'
import { getChallengeEndDate, isActive } from './goalUtils'
import { isAfter, parseISO } from 'date-fns'
import { auth0 } from '@/lib/auth0'

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

export const getHasActiveOrUpcomingGoal = async (today: string): Promise<boolean> => {
    const session = await auth0.getSession()
    if (!session) return false

  const sql = getQueryFunction()
  const external_id = await getExternalId()
  const goals = await sql`SELECT goals.id, goals.start_date, goals.length_days
    FROM goals
    join users on users.id=goals.user_id
    WHERE users.external_id=${external_id}
    ORDER BY start_date DESC, id ASC` as {start_date: string, length_days: number}[]

  const upcomingGoals = goals.map(({start_date, length_days}) => getChallengeEndDate(start_date, length_days)).filter((endDate) => {
    console.group(endDate)
    return isAfter(endDate, parseISO(today))
  })

  return upcomingGoals.length > 0
}
