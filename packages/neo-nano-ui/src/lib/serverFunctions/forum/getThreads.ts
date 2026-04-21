
'use server'
import { Comment, RemovalSatus, Thread } from '@/lib/types/forum.types'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { THREADS_PER_PAGE } from '@/lib/misc'
import { getRemovalStatus } from '../moderation/getRemovalStatus'
import { RawFlag } from './rowMappers'

export type ThreadSummary = Thread & Pick<Comment, 'text'> & {totalComments: number, authorDisplayName: string, removalStatus: RemovalSatus}

const getThreadSummaries = async (topicId: string, currentPage: number) => {
  const sql = getQueryFunction()

  const _threads = await sql`
    SELECT * FROM threads, 
      LATERAL (
        SELECT comments.comment_text, comments.is_deleted, users.display_name,
          jsonb_agg(jsonb_build_object('review_outcome', flags.review_outcome, 'id', flags.id)) as review_outcomes
        FROM comments JOIN users on comments.author=users.id 
          LEFT OUTER JOIN flags on comments.id=flags.comment
        WHERE comments.thread=threads.id
        GROUP BY comments.id, users.id
        ORDER BY comments.created_at asc 
        LIMIT 1),
      LATERAL (SELECT COUNT(comments.id), MAX(comments.created_at) as latest FROM comments
        WHERE comments.thread = threads.id
        GROUP BY threads.id)
    WHERE threads.topic=${topicId}
    ORDER BY threads.created_at DESC
    LIMIT ${THREADS_PER_PAGE}
    OFFSET ${(currentPage - 1) * THREADS_PER_PAGE}
    `
   
  const threadSummaries = _threads.map((_thread) => {
   
    const reviewOutcomes = (_thread.review_outcomes as Partial<RawFlag>[]).filter(({id}) => !!id).map(({review_outcome}) => review_outcome)
    const { id, latest, title, topic, author} = _thread
    return{ id, latest, title, topic, author,
    authorDisplayName: _thread.display_name,
    text: _thread.comment_text,
    totalComments: parseInt(_thread.count),
    removalStatus: getRemovalStatus(reviewOutcomes, _thread.is_deleted)
  }}) as ThreadSummary[]

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
