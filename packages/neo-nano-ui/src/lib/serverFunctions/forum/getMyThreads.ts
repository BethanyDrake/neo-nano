import { THREADS_PER_PAGE } from "@/lib/misc"
import { getQueryFunction } from "../_utils/getQueryFunction"
import { ThreadSummary } from "./getThreads"
import { getExternalId } from "../_utils/getUserIdFromSession"

export const getMyThreads = async () => {
  const sql = getQueryFunction()
    const myExternalId = await getExternalId()
 const _threads = await sql`
SELECT threads.id, threads.title, threads.author, threads.topic,threads.created_at, comment_details.*, comment_data.* 
FROM threads JOIN users ON threads.author=users.id, 
 LATERAL (
    SELECT comments.comment_text, users.display_name 
    FROM comments join users on comments.author=users.id
    WHERE comments.thread=threads.id order by comments.created_at desc LIMIT 1) as comment_details,
  LATERAL (
    SELECT COUNT(comments.id), MAX(comments.created_at) as latest 
    FROM comments
    WHERE comments.thread = threads.id
    GROUP BY threads.id) as comment_data
WHERE users.external_id=${myExternalId}
ORDER BY latest DESC
LIMIT ${THREADS_PER_PAGE}
    `

  const threadSummaries = _threads.map((_thread) => ({
    ..._thread,
    authorDisplayName: _thread.display_name,
    text: _thread.comment_text,
    totalComments: parseInt(_thread.count)
  })) as ThreadSummary[]

  return threadSummaries
}