import { LoadingButton } from '../buttons/BasicButton'
import { Column, LeftRow } from '../layout'
import RichTextDisplay from '../richText/RichTextDisplay'
import { CommentFlag } from '../serverFunctions/moderation/getFlaggedComments'
import { confirmFlag, refuteFlag } from '../serverFunctions/moderation/reviewFlaggedComment'
import classNames from './CommentCard.module.css'

export const FlaggedCommentCard = ({ comment, flag }: CommentFlag) => {
  return (
    <div className={classNames.card}>
      <Column>
        <div>
          <div>
            <span className={classNames['label']}>Flagged Comment:</span>{' '}
            <span>
              #{comment.id}-{flag.id}
            </span>
            <div className={classNames['angryPaper']}>
              <RichTextDisplay value={comment.richText} />
            </div>
          </div>
          <div>
            <span className={classNames['label']}>Reason:</span> <span>{flag.reason}</span>
          </div>
          <div>
            <span className={classNames['label']}>Details:</span> <span>{flag.details || '(none)'}</span>
          </div>
        </div>
        {flag.reviewOutcome ? 
          <div>
            {flag.reviewOutcome} by {flag.reviewedBy}
          </div>

        :
        <LeftRow>
          <LoadingButton onClick={() => refuteFlag(flag.id)}>Okay</LoadingButton>
          <LoadingButton onClick={() => confirmFlag(flag.id)} variant="angry">
            Inappropriate
          </LoadingButton>
        </LeftRow>
        }
        
      </Column>
    </div>
  )
}
