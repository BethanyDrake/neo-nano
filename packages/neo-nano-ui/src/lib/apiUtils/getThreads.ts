
import { Comment, Thread } from '@/lib/forum.types'
import { neon } from '@neondatabase/serverless'
if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL)

export type ThreadSummary = Thread & Pick<Comment, 'text'>

export async function getThreads(topicId: string): Promise<ThreadSummary[]>{
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
