'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ClientSideOnly } from '../ClientSideOnly'
import { Comment, Flag, Profile } from '../forum.types'
import { Column, Row } from '../layoutElements/flexLayouts'
import { ReportCommentModal } from '../modals/ReportCommentModal'
import classNames from './CommentCard.module.css'
import { LikeButton } from './LikeButton'
import { useIsLoggedIn } from '../context/UserContext'
import { ReplyToCommentForm } from '../expandableForms/AddCommentForm'
import { useLayoutEffect, useRef, useState } from 'react'
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
  const isLoggedIn = useIsLoggedIn()

  const [minHeight, setMinHeight] = useState<number>()
  const cardContainerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if(cardContainerRef.current) {
      setMinHeight(cardContainerRef.current.offsetHeight)
    }
  }, [])

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
    <div style={{minHeight: minHeight}} ref={cardContainerRef} className={classNames.card}>
      <Column>
      <Row justifyContent="space-between" alignItems="center" style={{ height: '1em' }}>
        <Link className={classNames.authorLink} href={`/profile/${author.id}`}>
          {author.displayName}:
        </Link>
        <Row>
          <LikeButton commentId={comment.id} />
          {isLoggedIn && <ReplyToCommentForm comment={comment} author={author} />}
          {isLoggedIn && <ReportCommentModal comment={comment} />}
        </Row>
      </Row>
      <ClientSideOnly fallback={<p>{comment.text}</p>}>
        <RichTextDisplay richText={comment.richText}/>
        </ClientSideOnly>
        <Row justifyContent="right">
          
          <time style={{height:'1em' }} className={classNames.datetime}>
              <ClientSideOnly>{comment.createdAt.toLocaleString()}</ClientSideOnly>
          </time>
        </Row>
        </Column>
    </div>
  )
}
