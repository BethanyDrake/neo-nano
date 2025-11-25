'use server'
import { Category, Topic } from '@/lib/types/forum.types'
import { getQueryFunction } from '../_utils/getQueryFunction'


export type CategorySummary = Category & {
  topics: (Topic & {total_threads: number, total_comments: number})[]
}

export const getForumTopics = async ():Promise<CategorySummary[]> => {
  console.log('getForumTopics')
  const sql = getQueryFunction()
  const categories = await sql`
SELECT categories.*,
  (SELECT jsonb_agg(TEMP.*) AS topics  from (SELECT 
  topics.*, count(distinct threads.id) as total_threads, count(comments.id) as total_comments
  FROM topics 
      LEFT JOIN threads on threads.topic=topics.id
      LEFT JOIN comments on comments.thread=threads.id
  WHERE topics.category = categories.id
    GROUP BY topics.id) as TEMP) 
FROM categories   
  `
  return categories as CategorySummary[]
}
