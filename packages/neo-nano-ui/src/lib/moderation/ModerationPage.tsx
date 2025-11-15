'use client'
import { FlaggedCommentCard } from '@/lib/commentCards/FlaggedCommentCard'
import { CommentFlag } from '@/lib/serverFunctions/moderation/getFlaggedComments'

export const ModerationPage = ({ flaggedComments }: { flaggedComments: CommentFlag[] }) => {
  return (
    <>
      {flaggedComments.map(({ comment, flag }) => (
        <FlaggedCommentCard key={`${comment.id}-${flag.id}`} comment={comment} flag={flag} />
      ))}
    </>
  )
}
