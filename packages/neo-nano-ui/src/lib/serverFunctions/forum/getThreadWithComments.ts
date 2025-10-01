'use server'

import { getSingle } from '@/lib/serverFunctions/_utils/getSingle'
import { Category, Thread, Topic } from '@/lib/forum.types'
import { CommentCardDataEntry } from '@/lib/commentCards/CommentCard'
import { getQueryFunction } from '@/lib/serverFunctions/_utils/getQueryFunction'
import { COMMENTS_PER_PAGE } from '@/lib/misc'

export type ReturnType = {
  commentCardDataEntries: CommentCardDataEntry
  totalComments: number
  thread: Thread
  category: Category
  topic: Topic
}

export const getThreadWithComments = async (threadId: string, currentPage: number = 1) => {
  const sql = getQueryFunction()
  const _comments =
    await sql`SELECT comment_text, rich_text, author, comments.created_at, comments.id, thread, display_name, jsonb_agg_strict(flags.*) as flags
    FROM comments JOIN users on comments.author=users.id
    LEFT OUTER JOIN  flags on flags.comment = comments.id
  WHERE thread=${threadId}
  GROUP BY comments.id, users.id
  ORDER BY comments.created_at
  LIMIT ${COMMENTS_PER_PAGE}
  OFFSET ${(currentPage - 1) * COMMENTS_PER_PAGE}
  `

  const totalComments = parseInt((
    await sql`SELECT count(comments.id), pg_typeof(count(comments.id)) FROM comments 
  WHERE thread=${threadId}`
  )[0].count)

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

  const commentCardDataEntries = _comments.map(({created_at, comment_text, rich_text, author, id, display_name, flags }) => ({
    comment: {
      text: comment_text,
      richText: rich_text,
      createdAt: created_at,
      id,
    },
    author: {
      id: author,
      displayName: display_name,
    },
    flags,
  }))

  return {
    totalComments,
    commentCardDataEntries,
    thread: threadDetails as Thread,
    category: category as Category,
    topic: topic as Topic,
  }
}
