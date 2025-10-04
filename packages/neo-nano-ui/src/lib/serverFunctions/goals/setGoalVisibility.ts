'use server'
import { Goal } from "../../forum.types"
import { getQueryFunction } from "../_utils/getQueryFunction"
import { getUserId } from "../_utils/getUserIdFromSession"

export async function setGoalVisibility(goal: Pick<Goal, 'id' | 'visibility'>) {
  const user_id = await getUserId()
  const sql = getQueryFunction()

  return sql`UPDATE goals set visibility=${goal.visibility}
       where user_id=${user_id}
       and id=${goal.id}`
}
