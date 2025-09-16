import classNames from './CommentCard.module.css'
import { Comment, Profile } from './forum.types'
import { Row } from './layout'
import { ReportCommentModal } from './modals/ReportCommentModal'

export type CommentCardDataEntry = {
  comment: Pick<Comment, 'id' | 'text'>
  author: Pick<Profile, 'id' | 'displayName'>
}

export const CommentCard = ({ comment, author }: CommentCardDataEntry) => {
  return (
    <div className={classNames.card}>
      <Row justifyContent="space-between">
        <h4>{author.displayName}:</h4> <ReportCommentModal comment={comment} />
      </Row>
      <p>{comment.text}</p>
    </div>
  )
}
