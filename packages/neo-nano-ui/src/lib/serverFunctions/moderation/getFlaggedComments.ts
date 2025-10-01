'use server'

import { Comment, Flag } from '@/lib/forum.types'
import { getDbConnection } from '../_utils/getDbConnection'

export type CommentFlag = {
  flag: Pick<Flag, 'id'|'reason'|'details'>,
comment: Pick<Comment, 'id' | 'text' | 'richText'>
}

export const getFlaggedComments = async ():Promise<CommentFlag[]> => {
  const sql = getDbConnection()

  const _flags = await sql`select flags.id as flag_id, comments.id as comment_id, comment_text, rich_text, reason, details from flags 
  join comments on flags.comment = comments.id;` 



  return _flags.map(({
    flag_id, comment_id, comment_text, rich_text, reason, details
  }) => ({
    flag: {
      id: flag_id,
      reason,
      details
    },
    comment: {
      id: comment_id,
      text: comment_text,
      richText: rich_text
    }
  }))
}
