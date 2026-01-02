'use server'
import { Category, Topic } from '@/lib/types/forum.types'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { redirect } from 'next/navigation'

export type GetTopicReturn = {
  topic: Topic
  category: Category
}

export async function getTopic(id: string): Promise<GetTopicReturn> {
  console.log('getTopic', id)
  const sql = getQueryFunction()
  const [_topic, _category] = await Promise.all([
    sql`SELECT id, title, description, icon, category FROM topics where id=${id} LIMIT 1`,
    sql`SELECT categories.* FROM categories join topics on topics.category=categories.id
    where topics.id=${id} LIMIT 1`,
  ])

  if (_topic.length !== 1 || _category.length !== 1) {
      console.warn(`Topic not found: ${id}`)
      redirect('/forum')
  }

  return { topic: _topic[0], category: _category[0] } as GetTopicReturn
}
