'use server'
import { Flag } from '../forum.types'
import { getDbConnection } from './getDbConnection'
import { getUserId } from './getUserIdFromSession'

export const flagComment = async (flag: Pick<Flag, 'comment' | 'reason' | 'details'>) => {
  const sql = getDbConnection()
  const reportedBy = await getUserId()
  await sql`insert into flags (comment, reported_by, reason, details) values 
(${flag.comment}, ${reportedBy}, ${flag.reason}, ${flag.details})
  ;`
}
