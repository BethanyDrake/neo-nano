'use server'

import { Goal } from '@/lib/forum.types'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'
import { getMyGoals } from './getMyGoals'

export const updateGoal = async (id: string, { title, target, visibility }: Pick<Goal, 'title' | 'target' | 'visibility'>) => {
  const sql = getQueryFunction()
  const user_id = await getUserId()

  await sql`update goals set title=${title}, target=${target}, visibility=${visibility}
    WHERE user_id=${user_id} AND id=${id}`

  return await getMyGoals()
}
