
import { Comment, Profile } from './forum.types'

export type CommentCardDataEntry =  {
        comment: Pick<Comment, 'id'| 'text'>
        author: Pick<Profile, 'id' | 'displayName'>
    }

export const CommentCard = ({ comment, author }: CommentCardDataEntry) => {
  return (
    <div>
      <p>
        <span style={{ fontWeight: 'bold' }}>{author.displayName}</span>: {comment.text}
      </p>
    </div>
  )
}
