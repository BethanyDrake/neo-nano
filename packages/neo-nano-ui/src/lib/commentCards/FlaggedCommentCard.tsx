import RichTextDisplay from '../richText/RichTextDisplay'
import { CommentFlag } from '../serverFunctions/moderation/getFlaggedComments'
import classNames from './CommentCard.module.css'

export const FlaggedCommentCard = ({ comment, flag }: CommentFlag) => {
  return (
    <div className={classNames.card}>
        <div>
        <span className={classNames['label']}>Flagged Comment:</span> <span>#{comment.id}-{flag.id}</span>
      <div className={classNames['angryPaper']}><RichTextDisplay value={comment.richText} /></div></div>
      <div>
        <span className={classNames['label']}>Reason:</span> <span>{flag.reason}</span>
      </div>
      <div>
        <span className={classNames['label']}>Details:</span> <span>{flag.details || '(none)'}</span>
      </div>
    </div>
  )
}
