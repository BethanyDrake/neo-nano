'use server'
import { getQueryFunction } from '../_utils/getQueryFunction'

export const getTopicIds  = async (): Promise<string[]> => {
  const sql = getQueryFunction()
  const _topics = await sql`SELECT topics.id, topics.title, COUNT(threads.id) AS thread_count
FROM topics
INNER JOIN threads ON topics.id = threads.topic
GROUP BY topics.id, topics.title
ORDER BY thread_count DESC`

  const ids = _topics.map(({id}) => (id as string))

   return  ids
}