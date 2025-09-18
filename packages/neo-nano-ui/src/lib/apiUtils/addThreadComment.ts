'use server'

import { getDbConnection } from "./getDbConnection"
import { getUserId } from "./getUserIdFromSession"

export async function addThreadComment(threadId: string, commentText: string) {
  const sql = getDbConnection()
  const author = await getUserId()

  return sql`INSERT INTO comments (comment_text, author, thread) 
      VALUES (${commentText}, ${author}, ${threadId})`

}
