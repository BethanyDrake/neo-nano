'use server'

import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import { getMyGoals } from './getMyGoals'

export const deleteGoal = async (id: string) => {
  console.log('deleteGoal')
  const sql = getQueryFunction()
  const user_id = await getUserId()

  await sql`DELETE FROM goals WHERE user_id=${user_id} AND id=${id}`

  return await getMyGoals()
}
