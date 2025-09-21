
"use client"
import dynamic from 'next/dynamic'
import { ClientSideOnly } from './ClientSideOnly'
import classNames from './CommentCard.module.css'
import { Comment, Profile } from './forum.types'
import { Row } from './layout'
import { ReportCommentModal } from './modals/ReportCommentModal'
const RichTextDisplay = dynamic(() => import('./richText/RichTextDisplay'), {
  ssr: false,
})

export type CommentCardDataEntry = {
  comment: Pick<Comment, 'id' | 'text' | 'richText'>
  author: Pick<Profile, 'id' | 'displayName'>
  flags: { reason: string }[]
}

export const CommentCard = ({ comment, author, flags }: CommentCardDataEntry) => {
  return (
    <div className={classNames.card}>
      {flags.length > 1 ? (
        <p className={classNames.flaggedCommentMessage}>
          This comment has been flagged as potentially innapropriate, and has been hidden while pending manual review.
        </p>
      ) : (
        <>
          <Row justifyContent="space-between">
            <h4>{author.displayName}:</h4> <ReportCommentModal comment={comment} />
          </Row>
          <div style={{visibility: 'hidden'}}>{comment.text}</div>
          <ClientSideOnly> <RichTextDisplay value={comment.richText}/></ClientSideOnly>
        </>
      )}
    </div>
  )
}
