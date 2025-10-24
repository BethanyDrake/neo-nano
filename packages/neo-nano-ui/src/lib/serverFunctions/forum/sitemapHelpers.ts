'use server'
import { getQueryFunction } from '../_utils/getQueryFunction'

export const getTopicIds = async (): Promise<string[]> => {
  const sql = getQueryFunction()
  const _topics = await sql`SELECT topics.id, topics.title, COUNT(threads.id) AS thread_count
FROM topics
INNER JOIN threads ON topics.id = threads.topic
GROUP BY topics.id, topics.title
ORDER BY thread_count DESC`

  const ids = _topics.map(({ id }) => id as string)

  return ids
}

export const getHotThreads = async (): Promise<{ threadId: string; topicId: string }[]> => {
  const sql = getQueryFunction()
  const threads = await sql`SELECT threads.id, threads.topic
FROM threads JOIN comments ON comments.thread = threads.id
GROUP BY threads.id
HAVING count(comments.id) > 1`
  return threads.map(({ id, topic }) => ({ threadId: id as string, topicId: topic as string }))
}
