'use server'
import { Goal } from "../../forum.types"
import { getQueryFunction } from "../_utils/getQueryFunction"
import { getUserId } from "../_utils/getUserIdFromSession"

export async function updateGoalProgress(goal: Pick<Goal, 'id' | 'records'>) {
  const user_id = await getUserId()
  const sql = getQueryFunction()

  return sql`UPDATE goals set records=${goal.records}
       where user_id=${user_id}
       and id=${goal.id}`
}
