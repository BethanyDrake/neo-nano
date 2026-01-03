'use server'

import { Category, Thread, Topic } from '@/lib/types/forum.types'
import { CommentCardDataEntry } from '@/lib/commentCards/CommentCard'
import { getQueryFunction } from '@/lib/serverFunctions/_utils/getQueryFunction'
import { COMMENTS_PER_PAGE } from '@/lib/misc'
import { redirect } from 'next/navigation'

export type ReturnType = {
  commentCardDataEntries: CommentCardDataEntry
  totalComments: number
  thread: Thread
  category: Category
  topic: Topic
}

// @ts-expect-error db mapper
const mapFlag = ({ id, comment, reported_by, created_at, reason, details, reviewed_by, review_outcome }) => ({
  id,
  comment,
  reportedBy: reported_by,
  createdAt: created_at,
  reason,
  details,
  reviewedBy: reviewed_by,
  reviewOutcome: review_outcome,
})

export const getThreadWithComments = async (threadId: string, currentPage: number = 1) => {
  console.log('getThreadWithComments')
  const _commentsPromise = getQueryFunction()`SELECT comment_text, rich_text, author, comments.created_at, comments.id, thread, display_name, jsonb_agg_strict(flags.*) as flags
    FROM comments JOIN users on comments.author=users.id
    LEFT OUTER JOIN  flags on flags.comment = comments.id
  WHERE thread=${threadId}
  GROUP BY comments.id, users.id
  ORDER BY comments.created_at
  LIMIT ${COMMENTS_PER_PAGE}
  OFFSET ${(currentPage - 1) * COMMENTS_PER_PAGE}
  `

  const totalCommentsPromise = getQueryFunction()`SELECT count(comments.id), pg_typeof(count(comments.id)) FROM comments 
  WHERE thread=${threadId}`

  const breadcrumbPromise = getQueryFunction()`select 
    jsonb_agg_strict(threads.*) as thread,
    jsonb_agg_strict(topics.*) as topic, 
    jsonb_agg_strict(categories.*) as category
    from threads join topics on threads.topic=topics.id
    join categories on topics.category=categories.id
    where threads.id=${threadId}
    group by categories.id, threads.id, topics.id
`

  const [_comments, totalCommentsData, breadcrumbData] = await Promise.all([
    _commentsPromise,
    totalCommentsPromise,
    breadcrumbPromise,
  ])

  if (totalCommentsData.length === 0 || breadcrumbData.length === 0) {
      console.warn(`Comments or breadcumbs not found for thread: ${threadId}`)
      redirect('/forum')
  }

  const totalComments = parseInt(totalCommentsData[0].count)
  const { thread, topic, category } = breadcrumbData[0]

  const commentCardDataEntries = _comments.map(
    ({ created_at, comment_text, rich_text, author, id, display_name, flags }) => ({
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
      flags: flags.map(mapFlag),
    }),
  )

  return {
    totalComments,
    commentCardDataEntries,
    thread: thread[0] as Thread,
    category: category[0] as Category,
    topic: topic[0] as Topic,
  }
}
