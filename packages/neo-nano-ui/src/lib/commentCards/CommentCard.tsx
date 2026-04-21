'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ClientSideOnly } from '../ClientSideOnly'
import { Comment, CommentSnapshot, Flag, Profile, RemovalSatus } from '@/lib/types/forum.types'
import { Column, Row } from '../layoutElements/flexLayouts'
import { ReportCommentWrapper } from '../modals/ReportCommentModal'
import classNames from './CommentCard.module.css'
import { LikeButton } from './LikeButton'
import { ReplyToCommentForm } from '../expandableForms/AddCommentForm'
import { createContext, PropsWithChildren, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import { MoreActions } from './MoreActions'
import { EditCommentForm } from '../expandableForms/EditCommentForm'
import { CommentSnapshotView } from './CommentSnapshotView'
import { DeleteCommentConfirmation } from './DeleteCommentConfirmation'
import { useThreadContext } from '../context/ThreadContext'
import { buildComment } from '../types/forum.builders'

const RichTextDisplay = dynamic(() => import('../richText/RichTextDisplay'), {
  ssr: false,
})

export type CommentCardDataEntry = {
  comment: Pick<Comment, 'id' | 'text' | 'richText' | 'createdAt'> & {removalStatus: RemovalSatus}
  author: Pick<Profile, 'id' | 'displayName'>
  flags: Flag[]
  snapshots: CommentSnapshot[]
}

export const buildCommentDataEntry = (overrides = {}): CommentCardDataEntry['comment'] => {
  return {
    ...buildComment(),
    removalStatus: null,
    ...overrides
  }
}

export const CommentCardContext = createContext<CommentCardDataEntry>({
  comment: {
    richText: '',
    id: '',
    text: '',
    createdAt: new Date(),
    removalStatus: null
  },
  author: {
    id: '',
    displayName: '',
  },
  flags: [],
  snapshots: [],
})

export const useCommentCardContext = () => useContext(CommentCardContext)

export type CommentAction = 'reply' | 'report' | 'edit' | 'delete'
type CommentActionContextType = {
  activeAction?: CommentAction
  setActiveAction: (action?: CommentAction) => void
  cancelAction: () => void
}

export const CommentActionContext = createContext<CommentActionContextType>({
  setActiveAction: () => {},
  cancelAction: () => {},
})

export const useCommentActionContext = () => useContext(CommentActionContext)

export const WithAction = ({ action, children }: { action: CommentAction } & PropsWithChildren) => {
  const { activeAction } = useCommentActionContext()
  return activeAction === action ? children : null
}

export const CommentCard = ({ comment, author, flags, snapshots }: CommentCardDataEntry) => {
  const hasUnreviewedFlag = flags.some(({ reviewOutcome }) => !reviewOutcome)
  const hasConfirmedFlag = flags.some(({ reviewOutcome }) => reviewOutcome === 'confirmed')
  const isLoggedIn = useIsLoggedIn()
  const { isLocked } = useThreadContext()

  const commentCardContext = useMemo(() => ({ comment, author, flags, snapshots }), [comment, author, flags, snapshots])
  const [minHeight, setMinHeight] = useState<number>()
  const cardContainerRef = useRef<HTMLDivElement>(null)
  const [activeAction, setActiveAction] = useState<CommentAction>()
  const actionContext = useMemo(() => {
    return {
      activeAction,
      setActiveAction,
      cancelAction: () => setActiveAction(undefined),
    }
  }, [activeAction])

  useLayoutEffect(() => {
    if (cardContainerRef.current) {
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
    <CommentCardContext.Provider value={commentCardContext}>
      <CommentActionContext.Provider value={actionContext}>
        <div style={{ minHeight: minHeight }} ref={cardContainerRef} className={classNames.card}>
          <Column>
            <Row
              justifyContent="space-between"
              alignItems="center"
              style={{ height: '1em', maxWidth: 'calc(100vw - 120px)' }}
            >
              <Row>
                <Link className={classNames.authorLink} href={`/profile/${author.id}`}>
                  {author.displayName}:
                </Link>
              </Row>
              <Row alignItems="center" style={{ translate: '26px' }}>
                {!isLocked && !comment.removalStatus && <LikeButton commentId={comment.id} />}
                {isLoggedIn && <MoreActions />}
              </Row>
            </Row>
            {comment.removalStatus === 'DELETED' && (
              <p className={classNames.deletedMessage}>This comment has been deleted by the author.</p>
            )}
            <ClientSideOnly fallback={<p>{comment.text}</p>}>
              <RichTextDisplay richText={comment.richText} />
            </ClientSideOnly>
            <div style={{ textAlign: 'right' }}>
              {snapshots.map((snapshot) => (
                <CommentSnapshotView key={`${comment.id}-${snapshot.version}`} snapshot={snapshot} />
              ))}

              {snapshots.length === 0 && (
                <time style={{ height: '1em' }} className={classNames.datetime}>
                  <ClientSideOnly>{comment.createdAt.toLocaleString()}</ClientSideOnly>
                </time>
              )}
            </div>
          </Column>
        </div>
        <WithAction action="reply">
          <ReplyToCommentForm />
        </WithAction>
        <WithAction action="report">
          <ReportCommentWrapper />
        </WithAction>
        <WithAction action="edit">
          <EditCommentForm />
        </WithAction>
        <WithAction action="delete">
          <DeleteCommentConfirmation />
        </WithAction>
      </CommentActionContext.Provider>
    </CommentCardContext.Provider>
  )
}
