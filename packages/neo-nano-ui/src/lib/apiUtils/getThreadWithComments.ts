'use server'

import { getSingle } from '@/lib/apiUtils/getSingle'
import { Category, Thread, Topic } from '@/lib/forum.types'
import { CommentCardDataEntry } from '../CommentCard'
import { getQueryFunction } from "@/lib/apiUtils/getQueryFunction";

export type ReturnType = {
  commentCardDataEntries: CommentCardDataEntry
  thread: Thread
  category: Category
  topic: Topic
}

export const getThreadWithComments = async (threadId: string) => {
  const sql = getQueryFunction()
  const _comments =
    await sql`SELECT comment_text, author, comments.id, thread, display_name, jsonb_agg_strict(flags.*) as flags
    FROM comments JOIN users on comments.author=users.id
    LEFT OUTER JOIN  flags on flags.comment = comments.id
  WHERE thread=${threadId}
  GROUP BY comments.id, users.id`

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

  const commentCardDataEntries = _comments.map(({ comment_text, author, id, display_name, flags }) => ({
    comment: {
      text: comment_text,
      id,
    },
    author: {
      id: author,
      displayName: display_name,
    },
    flags,
  }))

  return {
    commentCardDataEntries,
    thread: threadDetails as Thread,
    category: category as Category,
    topic: topic as Topic,
  }
}
