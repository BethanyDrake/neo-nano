import { LoadingButton } from '../buttons/BasicButton'
import { useThreadContext } from '../context/ThreadContext'
import { deleteComment } from '../serverFunctions/forum/addThreadComment'
import { useCommentActionContext, useCommentCardContext } from './CommentCard'

export const DeleteCommentConfirmation = () => {
  const { comment } = useCommentCardContext()
  const { updateCommentsData } = useThreadContext()
  const { cancelAction } = useCommentActionContext()

  return (
    <div
      ref={(node) => node?.scrollIntoView?.({ block: 'end', behavior: 'smooth' })}
      style={{
        border: '2px dashed var(--angry-vibrant)',
        borderLeft: 'none',
        borderRight: 'none',
        paddingTop: '24px',
        paddingBottom: '24px',
        textAlign: 'center',
      }}
    >
      <h3 style={{ paddingBottom: '10px' }}>Are you sure?</h3>
      <LoadingButton onClick={() => deleteComment(comment.id).then(cancelAction).then(updateCommentsData)}>
        Yes, delete my comment
      </LoadingButton>
    </div>
  )
}
