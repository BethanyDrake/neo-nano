"use client"
import { FlaggedCommentCard } from "@/lib/commentCards/FlaggedCommentCard"
import { CommentFlag } from "@/lib/serverFunctions/moderation/getFlaggedComments"
import { useRequireLogin } from "@/lib/useRequireLogin"

export const ModerationPage = ({flaggedComments}: {flaggedComments:CommentFlag[]}) => {
  useRequireLogin()
  return <>{
    flaggedComments.map(({comment, flag}) => (<FlaggedCommentCard key={`${comment.id}-${flag.id}`} comment={comment} flag={flag} />
      ))}</>
}

