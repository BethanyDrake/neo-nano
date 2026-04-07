'use server'

import { Comment, CommentSnapshot, Flag } from '@/lib/types/forum.types'
import { getDbConnection } from '../_utils/getDbConnection'
import { mapSnapshot } from '../forum/rowMappers'

export type CommentFlag = {
  flag: Pick<Flag, 'id'|'reason'|'details'| 'reviewOutcome' | 'reviewedBy'>,
comment: Pick<Comment, 'id' | 'text' | 'richText'>,
snapshots: CommentSnapshot[]
}

export const getFlaggedComments = async ():Promise<CommentFlag[]> => {
  console.log('getFlaggedComments')
  const sql = getDbConnection()

  const _flags = await sql`select 
    flags.id as flag_id, reason, details, reported_by, reviewed_by,
    comments.id as comment_id, comments.comment_text, comments.rich_text, reason, details, reported_by, reviewed_by, reviewed_by, review_outcome, 
    jsonb_agg_strict(comment_snapshots.*) as snapshots
    from flags 
  join comments on flags.comment = comments.id
  left outer join comment_snapshots on comments.id = comment_snapshots.snapshot_of
  group by comments.id, flags.id
  ;` 

  return _flags.map(({
    flag_id, comment_id, comment_text, rich_text, reason, details, reviewed_by, review_outcome, snapshots
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
    },
    snapshots: snapshots.map(mapSnapshot)

  }))
}
