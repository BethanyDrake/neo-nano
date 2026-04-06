'use client'
import { FlaggedCommentCard } from '@/lib/commentCards/FlaggedCommentCard'
import { getFlaggedComments } from '@/lib/serverFunctions/moderation/getFlaggedComments'
import { useQuery } from '@tanstack/react-query'

export const ModerationPage = () => {
  const {data: flaggedComments, isLoading} = useQuery({queryKey: ['flagged-comments'], queryFn: getFlaggedComments})
  if (isLoading) return <div>Loading...</div>
  if (!flaggedComments) return <div>Error.</div>
  if(flaggedComments.length === 0) return <div>
    No comments have been flagged.
  </div>
  return (
    <>
      {flaggedComments.map(({ comment, flag, snapshots }) => (
        <FlaggedCommentCard key={`${comment.id}-${flag.id}`} comment={comment} flag={flag} snapshots={snapshots}/>
      ))}
    </>
  )
}
