
'use server'
import { Comment, Thread } from '@/lib/forum.types'
import { getQueryFunction } from './getQueryFunction'

export type ThreadSummary = Thread & Pick<Comment, 'text'>

export async function getThreads(topicId: string): Promise<ThreadSummary[]>{
  const sql = getQueryFunction()
  const _threads = await sql`
    SELECT * FROM threads, 
      LATERAL (SELECT comment_text FROM comments WHERE comments.thread=threads.id LIMIT 1)
    WHERE threads.topic=${topicId}`

  const threads = _threads.map((_thread) => ({
    ..._thread,
    text: _thread.comment_text,
  }))

  return threads as ThreadSummary[]
}
