'use server'
import { auth0 } from '../auth0'
import { Flag } from '../forum.types'
import { getDbConnection } from './getDbConnection'
import { getUserIdFromSession } from './getUserIdFromSession'

export const flagComment = async (flag: Pick<Flag, 'comment' | 'reason' | 'details'>) => {
  const sql = getDbConnection()
  const session = await auth0.getSession()
  const reportedBy = await getUserIdFromSession(session, sql)
  await sql`insert into flags (comment, reported_by, reason, details) values 
(${flag.comment}, ${reportedBy}, ${flag.reason}, ${flag.details})
  ;`
}
