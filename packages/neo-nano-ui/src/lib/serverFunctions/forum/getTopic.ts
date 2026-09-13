'use server'
import { Category, Topic } from '@/lib/types/forum.types'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { redirect } from 'next/navigation'
import { getSingle } from '../_utils/getSingle'

type TopicSummary = { totalThreads: number; totalComments: number }
export type GetTopicReturn = {
  topic: Topic & TopicSummary
  category: Category
}
export const getTopicSummary = async (topicId: string): Promise<TopicSummary> => {
  console.log('getForumTopics')
  const sql = getQueryFunction()

  const topicSummary = await getSingle(
    'topic summary',
    sql`SELECT 
  count(distinct threads.id) as total_threads, count(comments.id) as total_comments
  FROM topics 
      LEFT JOIN threads on threads.topic=topics.id
      LEFT JOIN comments on comments.thread=threads.id
  WHERE topics.id = ${topicId}
  `,
  )

  return {
    totalThreads: parseInt(topicSummary.total_threads),
    totalComments: parseInt(topicSummary.total_comments)
  }
}

export async function getTopic(id: string): Promise<GetTopicReturn> {
  console.log('getTopic', id)
  const sql = getQueryFunction()
  const [_topic, _category, _topicSummary] = await Promise.all([
    sql`SELECT id, title, description, icon, category FROM topics where id=${id} LIMIT 1`,
    sql`SELECT categories.* FROM categories join topics on topics.category=categories.id
    where topics.id=${id} LIMIT 1`,
    getTopicSummary(id)
  ])

  if (_topic.length !== 1 || _category.length !== 1) {
      console.warn(`Topic not found: ${id}`)
      redirect('/forum')
  }

  return { topic: {..._topic[0], ..._topicSummary }, category: _category[0] } as GetTopicReturn
}
