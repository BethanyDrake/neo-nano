import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Comment, Profile } from './forum.types'
import { Row } from './layout'
import { faFontAwesomeFlag } from '@fortawesome/free-solid-svg-icons'
import classNames from './CommentCard.module.css'
import { flagComment } from './apiUtils/flagComment'

export type CommentCardDataEntry = {
  comment: Pick<Comment, 'id' | 'text'>
  author: Pick<Profile, 'id' | 'displayName'>
}

export const CommentCard = ({ comment, author }: CommentCardDataEntry) => {
  return (
    <div className={classNames.card}>
      <Row justifyContent="space-between">
        <h4>{author.displayName}:</h4>{' '}
        <button
          title="Report comment as inappropriate"
          onClick={() => {
            flagComment(comment.id)
          }}
          className={classNames.flag}
        >
          <FontAwesomeIcon icon={faFontAwesomeFlag} />
        </button>
      </Row>
      <p>{comment.text}</p>
    </div>
  )
}
