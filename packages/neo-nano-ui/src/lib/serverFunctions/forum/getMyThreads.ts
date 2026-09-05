import { THREADS_PER_PAGE } from '@/lib/misc'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { ThreadSummary } from './getThreads'
import { getExternalId } from '../_utils/getUserIdFromSession'
import { getRemovalStatus } from '../moderation/getRemovalStatus'

export const getMyThreads = async () => {
  const sql = getQueryFunction()
  const myExternalId = await getExternalId()
  const _threads = await sql`
SELECT threads.id, threads.title, threads.author, threads.topic,threads.created_at, comment_details.*, comment_data.*, initial_comment_status.*
FROM threads JOIN users ON threads.author=users.id, 
 LATERAL (
    SELECT comments.comment_text, users.display_name, comments.review_status, comments.is_deleted 
    FROM comments join users on comments.author=users.id
    WHERE comments.thread=threads.id
    AND NOT comments.is_deleted
    AND comments.review_status IS NULL
    ORDER BY comments.created_at desc LIMIT 1) as comment_details,
  LATERAL (
    SELECT comments.review_status, comments.is_deleted 
    FROM comments join users on comments.author=users.id
    WHERE comments.thread=threads.id order by comments.created_at asc LIMIT 1) as initial_comment_status,
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
    totalComments: parseInt(_thread.count),
    removalStatus: getRemovalStatus(_thread.review_status, _thread.is_deleted),
  })) as ThreadSummary[]

  return threadSummaries
}
