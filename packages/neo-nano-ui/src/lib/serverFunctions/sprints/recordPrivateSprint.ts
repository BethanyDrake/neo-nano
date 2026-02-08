'use server'
import camelcaseKeys from 'camelcase-keys'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import { Visibility } from "@/lib/types/forum.types"

export type Sprint = {
  id: string
  startTime: Date
  durationSeconds: number
  visibility: Visibility

}
export type ParticipationState = 'registered' | 'completed'
export type UserSprint = Sprint & {
  wordCount: number | null
  participationState: ParticipationState
}

export type CompletedSprint = Sprint & {
  wordCount: number,
  participationState: 'completed'
}

const registerForSprint = async (userId: string, sprintId: string) => {
  const sql = getQueryFunction()
  await sql`INSERT into user_sprints (user_id, sprint_id, word_count, participation_state) 
  values (${userId}, ${sprintId}, null, 'registered')`
}

export const cancelSprintRegistration = async (userId: string, sprintId: string) => {
  const sql = getQueryFunction()

  await sql`delete from user_sprints 
  where user_id=${userId} and sprint_id=${sprintId} and participation_state='registered'`
}

export const cancelPrivateSprint = async (sprintId: string) => {
  const userId = await getUserId()
  await cancelSprintRegistration(userId, sprintId)
}


export const createPrivateSprint = async (startTime: Date, durationSeconds: number): Promise<Sprint> => {
  const sql = getQueryFunction()
  const [createdSprint] = await sql`INSERT into sprints (start_time, duration_seconds, visibility)
  values (${startTime}, ${durationSeconds}, 'private')
  returning *`
  
  const userId = await getUserId()
  await registerForSprint(userId, createdSprint.id)
  return camelcaseKeys(createdSprint) as Sprint
}

export const getMySprintLog = async () => {
  const sql = getQueryFunction()
  const userId = await getUserId()
  const sprints = await sql`
  select * 
  from sprints join user_sprints on sprint_id = sprints.id 
  where user_sprints.user_id=${userId}
  and user_sprints.participation_state='completed'
  order by sprints.start_time desc
  limit 10`
  return sprints.map((sprint) => camelcaseKeys(sprint) as CompletedSprint)
}

export const completePrivateSprint = async (
  sprintId: string,
  adjustedDurationSeconds: number,
  wordCount: number,
) => {
  console.log('completePrivateSprint')
  const sql = getQueryFunction()
  const userId = await getUserId()

  await sql`UPDATE sprints set duration_seconds=${adjustedDurationSeconds}
   where id=${sprintId};`

  await sql`UPDATE user_sprints set word_count=${wordCount}, participation_state='completed'
  where user_id=${userId} and sprint_id=${sprintId}`

}
