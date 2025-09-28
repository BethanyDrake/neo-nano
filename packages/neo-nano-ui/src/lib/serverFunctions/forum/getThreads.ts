
'use server'
import { Comment, Thread } from '@/lib/forum.types'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { THREADS_PER_PAGE } from '@/lib/misc'

export type ThreadSummary = Thread & Pick<Comment, 'text'>

export async function getThreads(topicId: string, currentPage: number = 1){
  const sql = getQueryFunction()
  const _threads = await sql`
    SELECT * FROM threads, 
      LATERAL (SELECT comment_text FROM comments WHERE comments.thread=threads.id LIMIT 1)
    WHERE threads.topic=${topicId}
    ORDER BY threads.created_at DESC
    LIMIT ${THREADS_PER_PAGE}
    OFFSET ${(currentPage - 1) * THREADS_PER_PAGE}
    `

  const threadSummaries = _threads.map((_thread) => ({
    ..._thread,
    text: _thread.comment_text,
  })) as ThreadSummary[]

  const totalThreads = (await sql` SELECT count(*) FROM threads
    WHERE threads.topic=${topicId}`)[0].count


  return {
    threadSummaries, totalThreads
  }
}
