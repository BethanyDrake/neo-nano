import { getQueryFunction } from "../_utils/getQueryFunction"

export const registerForSprint = async (userId: string, sprintId: string) => {
  const sql = getQueryFunction()
  await sql`INSERT into user_sprints (user_id, sprint_id, word_count, participation_state) 
  values (${userId}, ${sprintId}, null, 'registered')
  ON CONFLICT DO NOTHING
  `
}

export const cancelSprintRegistration = async (userId: string, sprintId: string) => {
  const sql = getQueryFunction()

  await sql`delete from user_sprints 
  where user_id=${userId} and sprint_id=${sprintId} and participation_state='registered'`
}
