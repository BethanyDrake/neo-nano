'use server'

import { getDbConnection } from "../_utils/getDbConnection"
import { getUserId } from "../_utils/getUserIdFromSession"

export async function addThreadComment(threadId: string, commentText: string, richText: string) {
  const sql = getDbConnection()
  const author = await getUserId()

  return sql`INSERT INTO comments (comment_text, author, thread, rich_text) 
      VALUES (${commentText}, ${author}, ${threadId}, ${richText})`

}
