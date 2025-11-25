'use server'
import { Goal } from '@/lib/types/forum.types'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import { getMyGoals } from './getMyGoals'

export async function setGoalVisibility(goal: Pick<Goal, 'id' | 'visibility'>) {
  const user_id = await getUserId()
  const sql = getQueryFunction()

  await sql`UPDATE goals set visibility=${goal.visibility}
       where user_id=${user_id}
       and id=${goal.id}`

  return await getMyGoals()
}
