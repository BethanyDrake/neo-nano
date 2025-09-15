'use server'
import { auth0 } from '../auth0'
import { getDbConnection } from './getDbConnection'
import { getUserIdFromSession } from './getUserIdFromSession'

export const flagComment = async (commentId: string) => {
  const sql = getDbConnection()
  const session = await auth0.getSession()
  const reportedBy = await getUserIdFromSession(session, sql)
  await sql`insert into flags (comment, reported_by, reason) values 
(${commentId}, ${reportedBy}, 'other' )
  ;`
}
