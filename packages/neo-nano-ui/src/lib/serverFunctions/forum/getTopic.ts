'use server'
import { getSingle } from '@/lib/serverFunctions/_utils/getSingle'
import { Category, Topic } from '@/lib/forum.types'
import { getQueryFunction } from '../_utils/getQueryFunction'

export type GetTopicReturn = {
  topic: Topic
  category: Category
}

export async function getTopic(id: string): Promise<GetTopicReturn> {
  const sql = getQueryFunction()
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
