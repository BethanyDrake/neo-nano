import classNames from './CommentCard.module.css'
import { Comment, Profile } from './forum.types'
import { Row } from './layout'
import { ReportCommentModal } from './modals/ReportCommentModal'

export type CommentCardDataEntry = {
  comment: Pick<Comment, 'id' | 'text'>
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
          <p>{comment.text}</p>
        </>
      )}
    </div>
  )
}
