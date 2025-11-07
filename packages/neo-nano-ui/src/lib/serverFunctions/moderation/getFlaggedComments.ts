'use server'

import { Comment, Flag } from '@/lib/forum.types'
import { getDbConnection } from '../_utils/getDbConnection'

export type CommentFlag = {
  flag: Pick<Flag, 'id'|'reason'|'details'| 'reviewOutcome' | 'reviewedBy'>,
comment: Pick<Comment, 'id' | 'text' | 'richText'>,
}

export const getFlaggedComments = async ():Promise<CommentFlag[]> => {
  console.log('getFlaggedComments')
  const sql = getDbConnection()

  const _flags = await sql`select 
    flags.id as flag_id, reason, details, reported_by, reviewed_by,
    comments.id as comment_id, comment_text, rich_text, reason, details, reported_by, reviewed_by, reviewed_by, review_outcome from flags 
  join comments on flags.comment = comments.id
  ;` 

  return _flags.map(({
    flag_id, comment_id, comment_text, rich_text, reason, details, reviewed_by, review_outcome
  }) => ({
    flag: {
      id: flag_id,
      reason,
      details,
      reviewedBy: reviewed_by,
      reviewOutcome: review_outcome
    },
    comment: {
      id: comment_id,
      text: comment_text,
      richText: rich_text
    }
  }))
}
