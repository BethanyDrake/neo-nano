import { THREADS_PER_PAGE } from "@/lib/misc"
import { getQueryFunction } from "../_utils/getQueryFunction"
import { ThreadSummary } from "./getThreads"

export const getRecentlyUpdatedThreads = async () => {
  const sql = getQueryFunction()
 const _threads = await sql`
    SELECT * FROM threads, 
      LATERAL (SELECT comment_text FROM comments WHERE comments.thread=threads.id order by comments.created_at desc LIMIT 1),
      LATERAL (SELECT COUNT(comments.id), MIN(comments.created_at) as latest FROM comments
        WHERE comments.thread = threads.id
        GROUP BY threads.id)
    ORDER BY latest DESC
    LIMIT ${THREADS_PER_PAGE}
    `

  const threadSummaries = _threads.map((_thread) => ({
    ..._thread,
    text: _thread.comment_text,
    totalComments: parseInt(_thread.count)
  })) as ThreadSummary[]

  return threadSummaries
}