'use client'
import dynamic from 'next/dynamic'
import { ClientSideOnly } from '../ClientSideOnly'
import classNames from './CommentCard.module.css'
import { Comment, Flag, Profile } from '../forum.types'
import { Row } from '../layout'
import { ReportCommentModal } from '../modals/ReportCommentModal'
import Link from 'next/link'
const RichTextDisplay = dynamic(() => import('../richText/RichTextDisplay'), {
  ssr: false,
})

export type CommentCardDataEntry = {
  comment: Pick<Comment, 'id' | 'text' | 'richText' | 'createdAt'>
  author: Pick<Profile, 'id' | 'displayName'>
  flags: Flag[]
}

export const CommentCard = ({ comment, author, flags }: CommentCardDataEntry) => {
  const hasUnreviewedFlag = flags.some(({ reviewOutcome }) => !reviewOutcome)
  const hasConfirmedFlag = flags.some(({ reviewOutcome }) => reviewOutcome === 'confirmed')

  if (hasConfirmedFlag) {
    return (
      <div className={classNames.card}>
        <p className={classNames.confirmedInappropriateMessage}>This comment has been removed.</p>
      </div>
    )
  }

  if (hasUnreviewedFlag) {
    return (
      <div className={classNames.card}>
        <p className={classNames.flaggedCommentMessage}>
          This comment has been flagged as potentially inappropriate, and has been hidden while pending manual review.
        </p>
      </div>
    )
  }

  return (
    <div className={classNames.card}>
      <Row justifyContent="space-between">
       <Link className={classNames.authorLink} href={`/profile/${author.id}`}>{author.displayName}:</Link>
        <ReportCommentModal comment={comment} />
      </Row>
      <div className={classNames.hidden}>{comment.text}</div>
      <ClientSideOnly>
        <RichTextDisplay value={comment.richText} />
        <Row justifyContent="right">
          <span style={{ paddingTop: '16px' }} className={classNames.datetime}>
            {comment.createdAt.toLocaleString()}
          </span>
        </Row>
      </ClientSideOnly>
    </div>
  )
}
