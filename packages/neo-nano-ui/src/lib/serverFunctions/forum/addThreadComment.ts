'use server'

import camelcaseKeys from 'camelcase-keys'
import { getDbConnection } from '../_utils/getDbConnection'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getSingle } from '../_utils/getSingle'
import { getUserId } from '../_utils/getUserIdFromSession'
import { Comment } from '@/lib/types/forum.types'

export async function addThreadComment(threadId: string, commentText: string, richText: string) {
  console.log('addThreadComment')
  const sql = getDbConnection()
  const author = await getUserId()

  return sql`INSERT INTO comments (comment_text, author, thread, rich_text) 
      VALUES (${commentText}, ${author}, ${threadId}, ${richText})`
}

type RawComment = {
  id: string
  version: number
  comment_text: string
  rich_text: string
  updated_at: Date
  created_at: Date
  is_deleted: boolean
  author: string
}

const transformRawComment = (rawComment: RawComment): Comment => {
  return {
    ...camelcaseKeys(rawComment),
    text: rawComment.comment_text
  }
}

const getAuthorComment = (commentId: string, author: string): Promise<RawComment> =>
  getSingle(
    'comment',
    getQueryFunction()`
    select * from comments 
    where comments.id=${commentId}
    and comments.author=${author}
    `,
  ) as Promise<RawComment>

const createSnapshot = async (comment: RawComment) =>
  getQueryFunction()`INSERT INTO comment_snapshots (snapshot_of, version, comment_text, rich_text, posted_at)
      VALUES (${comment.id}, ${comment.version}, ${comment.comment_text}, ${comment.rich_text}, ${comment.updated_at}
)`

const _updateComment = async (
  commentId: string,
  newVersion: number,
  commentText: string,
  richText: string,
  isDeleted: boolean = false,
): Promise<RawComment> => {
  const results = await getQueryFunction()`UPDATE comments
    SET comment_text=${commentText},
    rich_text=${richText},
    updated_at=Now(),
    version=${newVersion},
    is_deleted=${isDeleted}
    where comments.id = ${commentId}
    returning comments.*
    `
  if (results.length !== 1) {
    throw Error(`Failed to update comment`)
  }
  return results[0] as RawComment
}

export async function updateComment(commentId: string, commentText: string, richText: string) {
  console.log('updating comment', commentId, commentText)
  const author = await getUserId()
  const comment = await getAuthorComment(commentId, author)
  await createSnapshot(comment)
  const updatedComment = await _updateComment(comment.id, comment.version + 1, commentText, richText)

  return transformRawComment(updatedComment)
}

export async function deleteComment(commentId: string): Promise<Comment> {
  console.log('deleting comment', commentId)
  const author = await getUserId()
  const comment = await getAuthorComment(commentId, author)
  await createSnapshot(comment)
  const updatedComment = await _updateComment(comment.id, comment.version + 1, '', '', true)

  return transformRawComment(updatedComment)
}
