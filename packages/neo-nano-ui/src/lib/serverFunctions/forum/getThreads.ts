
'use server'
import { Comment, Thread } from '@/lib/forum.types'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { THREADS_PER_PAGE } from '@/lib/misc'

export type ThreadSummary = Thread & Pick<Comment, 'text'> & {totalComments: number}

const getThreadSummaries = async (topicId: string, currentPage: number) => {
  const sql = getQueryFunction()
 const _threads = await sql`
    SELECT * FROM threads, 
      LATERAL (SELECT comment_text FROM comments WHERE comments.thread=threads.id order by comments.created_at asc LIMIT 1),
      LATERAL (SELECT COUNT(comments.id), MAX(comments.created_at) as latest FROM comments
        WHERE comments.thread = threads.id
        GROUP BY threads.id)
    WHERE threads.topic=${topicId}
    ORDER BY threads.created_at DESC
    LIMIT ${THREADS_PER_PAGE}
    OFFSET ${(currentPage - 1) * THREADS_PER_PAGE}
    `

  const threadSummaries = _threads.map((_thread) => ({
    ..._thread,
    text: _thread.comment_text,
    totalComments: parseInt(_thread.count)
  })) as ThreadSummary[]

  return threadSummaries
}

const getTotalThreads = async (topicId: string) => {
  const sql = getQueryFunction()
  return (await sql` SELECT count(*) FROM threads
    WHERE threads.topic=${topicId}`)[0].count
}

export async function getThreads(topicId: string, currentPage: number = 1){
  console.log('getThreads', topicId )
  
  const [threadSummaries, totalThreads] = await Promise.all([getThreadSummaries(topicId, currentPage), getTotalThreads( topicId)])


  return {
    threadSummaries, totalThreads
  }
}
