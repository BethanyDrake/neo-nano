'use server'

import { Flag } from '@/lib/types/forum.types'
import { getDbConnection } from '../_utils/getDbConnection'
import { getUserId } from '../_utils/getUserIdFromSession'
import { updateReviewStatus } from './updateReviewStatus'

export const flagComment = async (flag: Pick<Flag, 'comment' | 'reason' | 'details'>) => {
  console.log('flagComment')
  const sql = getDbConnection()
  const reportedBy = await getUserId()
  await sql`insert into flags (comment, reported_by, reason, details) values 
(${flag.comment}, ${reportedBy}, ${flag.reason}, ${flag.details})
  ;`

  await updateReviewStatus(flag.comment)
}
