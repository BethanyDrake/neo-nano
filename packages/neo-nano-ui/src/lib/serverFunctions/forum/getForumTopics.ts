'use server'
import { Category, Topic } from '@/lib/forum.types'
import { getQueryFunction } from '../_utils/getQueryFunction'


export type CategoryData = Category & {
  topics: Topic[]
}

export const getForumTopics = async ():Promise<CategoryData[]> => {
  const sql = getQueryFunction()
  const categories = await sql`
  SELECT categories.*,
  (SELECT jsonb_agg(topics.*) AS topics FROM topics WHERE topics.category = categories.id)
FROM categories  
  `
  return categories as CategoryData[]
}
