'use server'
import { Category } from '@/lib/forum.types'
import { getQueryFunction } from '../_utils/getQueryFunction'

export const getForumTopics  = async () => {
  const sql = getQueryFunction()
  const _categories = await sql`SELECT * FROM categories`
  const _topics = await sql`SELECT * FROM topics`

  const categories = _categories.map((category) => ({
    ...category,
    topics: _topics.filter(({ category: topicCategory }) => topicCategory === category.id),
  })) as Category[]

   return  categories
}