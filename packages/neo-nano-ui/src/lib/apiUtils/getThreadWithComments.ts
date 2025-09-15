import { getSingle } from '@/lib/apiUtils/getSingle'
import { Category, Thread, Topic } from '@/lib/forum.types'
import { NeonQueryFunction } from '@neondatabase/serverless'
import { CommentCardDataEntry } from '../CommentCard';

export type ReturnType = {
  commentCardDataEntries: CommentCardDataEntry
  thread: Thread
  category: Category
  topic: Topic
}


export const getThreadWithComments = async (threadId: string, sql:  NeonQueryFunction<false, false>,) => {
  const _comments = await sql`SELECT comment_text, author, comments.id, thread, display_name 
    FROM comments JOIN users on comments.author=users.id
  WHERE thread=${threadId}`

  const threadDetails = await getSingle(
    'thread',
    sql`SELECT title, author, id, topic FROM threads
  WHERE id=${threadId}`,
  )

  const topic = await getSingle(
    'topic',
    sql`SELECT id, title, description, icon, category FROM topics where id=${threadDetails.topic} LIMIT 1`,
  )
  const category = await getSingle('category', sql`SELECT id, title FROM categories where id=${topic.category} LIMIT 1`)

  const commentCardDataEntries = _comments.map(({ comment_text, author, id, display_name }) => ({
    comment: {
      text: comment_text,
      id,
    },
    author: {
      id: author,
      displayName: display_name
    }
  }))

  return { commentCardDataEntries, thread: threadDetails as Thread, category: category as Category, topic: topic as Topic }
}
