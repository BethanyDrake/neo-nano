import { getSingle } from '@/lib/apiUtils/getSingle'
import { Category, Topic } from '@/lib/forum.types'
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL)

export type GetTopicReturn = {
  topic: Topic
  category: Category
}

export async function getTopic(id: string): Promise<GetTopicReturn> {
  const topic = (await getSingle(
    'topic',
    sql`SELECT id, title, description, icon, category FROM topics where id=${id} LIMIT 1`,
  )) as Topic
  const category = (await getSingle(
    'category',
    sql`SELECT id, title FROM categories where id=${topic.category} LIMIT 1`,
  )) as Category

  return { topic, category }
}
