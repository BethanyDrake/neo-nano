import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { useCommentLikes } from '../context/ReactionContext'
import { useLoadableOnClick } from '../buttons/usLoadableOnClick'
import { likeComment, unlikeComment } from '../serverFunctions/forum/likeComment'
import classNames from './CommentCard.module.css'
import { ReactionButton } from '../buttons/ExtendableIconButton'

export const LikeButton = ({ commentId }: { commentId: string }) => {
  const me = useContext(UserContext)
  const { likes, refresh, initialLoad } = useCommentLikes(commentId)

  const isLiked = me && likes.includes(me?.id)

  const { onClick, isLoading } = useLoadableOnClick(async () => {
    if (isLiked) {
      await unlikeComment(commentId)
    } else {
      await likeComment(commentId)
    }
    await refresh()
  })

  if (initialLoad) {
    return null
  }
  return (
    <div className={classNames.likeButtonContainer}>
      <span className={classNames.likeButtonText}>{likes.length > 0 ? likes.length : ''}</span>
      <ReactionButton disabled={!me} onClick={onClick} isLoading={isLoading} isActive={!!isLiked} />
    </div>
  )
}
