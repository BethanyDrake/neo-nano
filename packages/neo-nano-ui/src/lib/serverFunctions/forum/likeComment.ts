'use server'

import { getDbConnection } from "../_utils/getDbConnection"
import { getUserId } from "../_utils/getUserIdFromSession"

export async function likeComment(commentId: string) {
  const sql = getDbConnection()
  const user = await getUserId()

  return sql`INSERT INTO comment_reactions (comment_id, user_id, reaction) 
      VALUES (${commentId}, ${user}, 'like')`
}


export async function unlikeComment(commentId: string) {
  const sql = getDbConnection()
  const user = await getUserId()

  return sql`delete from comment_reactions
      where comment_id=${commentId} and user_id=${user} and reaction='like'`

}