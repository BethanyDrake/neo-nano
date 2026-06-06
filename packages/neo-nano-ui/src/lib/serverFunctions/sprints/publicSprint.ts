'use server'
import camelcaseKeys from 'camelcase-keys'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { Sprint } from './recordPrivateSprint'
import { addHours } from 'date-fns'
import { getUserId } from '../_utils/getUserIdFromSession'
import { registerForSprint } from './registerForSprint'

export const createPublicSprint = async (startTime: Date, durationSeconds: number): Promise<Sprint> => {
  const sql = getQueryFunction()
  const [createdSprint] = await sql`INSERT into sprints (start_time, duration_seconds, visibility)
  values (${startTime.toUTCString()}, ${durationSeconds}, 'public')
  returning start_time AT TIME ZONE 'UTC' as start_time, visibility, id, duration_seconds`

  return camelcaseKeys(createdSprint) as Sprint
}

export type PublicSprintLogEntry = {
  participationState: 'completed' | 'registered',
  wordCount: number | null,
  userId: string
  displayName: string

}

export const getPublicSprintLog = async (id: string) => {
  const rows = 
    await getQueryFunction()`SELECT 
    user_sprints.word_count, user_sprints.user_id, users.display_name, user_sprints.participation_state
    FROM user_sprints
    LEFT JOIN users on user_sprints.user_id=users.id
    WHERE user_sprints.sprint_id=${id}
    `
    return rows.map((row) => camelcaseKeys(row) as PublicSprintLogEntry )

}

export const getMyUpcomingSprints = async () => {
  const sql = getQueryFunction()
   const userId = await getUserId()
  const rows =
    await sql`SELECT start_time AT TIME ZONE 'UTC' as start_time, visibility, id, duration_seconds, user_sprints.participation_state  
    from sprints join user_sprints on sprints.id = user_sprints.sprint_id
    where user_sprints.user_id =${userId}
    and start_time>=now()
    ORDER BY start_time ASC`
  return rows.map((row) => camelcaseKeys(row) as Sprint)
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

export const registerForPublicSprint = async (sprintId: string) => {
    const userId = await getUserId()
    await registerForSprint(userId, sprintId)
}

export const completePublicSprint = async (
  sprintId: string,
  wordCount: number,
) => {
  console.log('completePublicSprint')
  const sql = getQueryFunction()
  const userId = await getUserId()

  await sql`UPDATE user_sprints set word_count=${wordCount}, participation_state='completed'
  where user_id=${userId} and sprint_id=${sprintId}`

}
