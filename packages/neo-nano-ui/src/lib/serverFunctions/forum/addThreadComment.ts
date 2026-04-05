'use server'

import camelcaseKeys from "camelcase-keys"
import { getDbConnection } from "../_utils/getDbConnection"
import { getQueryFunction } from "../_utils/getQueryFunction"
import { getSingle } from "../_utils/getSingle"
import { getUserId } from "../_utils/getUserIdFromSession"

export async function addThreadComment(threadId: string, commentText: string, richText: string) {
  console.log('addThreadComment')
  const sql = getDbConnection()
  const author = await getUserId()

  return sql`INSERT INTO comments (comment_text, author, thread, rich_text) 
      VALUES (${commentText}, ${author}, ${threadId}, ${richText})`

}

export async function updateComment(commentId: string, commentText: string, richText: string) {
        console.log("updating comment", commentId, commentText)
   const author = await getUserId()
  const comment = await getSingle('comment', getQueryFunction()`
    select * from comments 
    where comments.id=${commentId}
    and comments.author=${author}
    `)

    console.log("comment snapshot", comment)


    await getQueryFunction()`INSERT INTO comment_snapshots (snapshot_of, version, comment_text, rich_text, posted_at)
      VALUES (${comment.id}, ${comment.version}, ${comment.comment_text}, ${comment.rich_text}, ${comment.updated_at}
)
    `

    const results = await getQueryFunction()`UPDATE comments
    SET comment_text=${commentText},
    rich_text=${richText},
    updated_at=Now(),
    version=${comment.version + 1}
    where comments.id = ${comment.id}
    returning comments.*
    `

   console.log("results", results)
      if (results.length !== 1) {
        throw Error(`Failed to update comment`)
    }
  

  
  return camelcaseKeys(results[0])
}
