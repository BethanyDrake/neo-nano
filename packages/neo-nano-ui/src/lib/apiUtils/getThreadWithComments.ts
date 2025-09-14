import { getSingle } from '@/lib/apiUtils/getSingle'
import { Category, Comment, Thread, Topic } from '@/lib/forum.types'
import { NeonQueryFunction } from '@neondatabase/serverless'

export type ReturnType = {
  comments: Comment[]
  thread: Thread
  category: Category
  topic: Topic
}


export const getThreadWithComments = async (threadId: string, sql:  NeonQueryFunction<false, false>,) => {
  const _comments = await sql`SELECT comment_text, author, comments.id, thread, display_name 
    FROM comments JOIN users on comments.author=users.id
  WHERE thread=${threadId}`
  console.log({_comments})

  const threadDetails = await getSingle(
    'thread',
    sql`SELECT title, author, id, topic FROM threads
  WHERE id=${threadId}`,
  )

  console.log({threadDetails})
  

  const topic = await getSingle(
    'topic',
    sql`SELECT id, title, description, icon, category FROM topics where id=${threadDetails.topic} LIMIT 1`,
  )
  console.log({topic})
  const category = await getSingle('category', sql`SELECT id, title FROM categories where id=${topic.category} LIMIT 1`)

  console.log({category})
  const comments = _comments.map(({ comment_text, author, id, thread, display_name }) => ({
    text: comment_text,
    author,
    id,
    thread,
    authorDisplayName: display_name,
  }))

  return { comments, thread: threadDetails as Thread, category: category as Category, topic: topic as Topic }
}
