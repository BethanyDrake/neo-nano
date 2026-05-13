'use server'
import camelcaseKeys from 'camelcase-keys'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { Sprint } from './recordPrivateSprint'
import { addHours } from 'date-fns'

export const createPublicSprint = async (startTime: Date, durationSeconds: number): Promise<Sprint> => {
  const sql = getQueryFunction()
  const [createdSprint] = await sql`INSERT into sprints (start_time, duration_seconds, visibility)
  values (${startTime.toUTCString()}, ${durationSeconds}, 'public')
  returning start_time AT TIME ZONE 'UTC' as start_time, visibility, id, duration_seconds`

  console.log(createdSprint)

  return camelcaseKeys(createdSprint) as Sprint
}

export const getUpcomingPublicSprints = async () => {
  const sql = getQueryFunction()
  const rows =
    await sql`SELECT start_time AT TIME ZONE 'UTC' as start_time, visibility, id, duration_seconds  from sprints 
    where visibility='public' and start_time>=now()`
  return rows.map((row) => camelcaseKeys(row) as Sprint)
}

export const getPastRecentSprints = async (maxAgeHours: number) => {
  const compareTime = addHours(Date.now(), -1 * maxAgeHours)
  const rows =
    await getQueryFunction()`SELECT start_time AT TIME ZONE 'UTC' as start_time, visibility, id, duration_seconds from sprints where start_time between ${compareTime.toUTCString()} and now() and
    visibility='public'`
  return rows.map((row) => camelcaseKeys(row) as Sprint)
}
