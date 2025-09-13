import { Category } from '@/lib/forum.types'
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL)

export const getForumTopics  = async () => {
  const _categories = await sql`SELECT * FROM categories`
  const _topics = await sql`SELECT * FROM topics`

  const categories = _categories.map((category) => ({
    ...category,
    topics: _topics.filter(({ category: topicCategory }) => topicCategory === category.id),
  })) as Category[]

   return  categories
}