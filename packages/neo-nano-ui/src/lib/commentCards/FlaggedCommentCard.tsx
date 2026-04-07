import {  useQueryClient } from '@tanstack/react-query'
import {  LoadingButton } from '../buttons/BasicButton'
import { Column, LeftRow } from '../layoutElements/flexLayouts'
import RichTextDisplay from '../richText/RichTextDisplay'
import { CommentFlag, getFlaggedComments } from '../serverFunctions/moderation/getFlaggedComments'
import { confirmFlag, refuteFlag } from '../serverFunctions/moderation/reviewFlaggedComment'
import classNames from './CommentCard.module.css'

export const FlaggedCommentCard = ({ comment, flag, snapshots }: CommentFlag) => {
  const queryClient = useQueryClient()
  const updateFlaggedComments = async () => {
    const newFlaggedComments = await getFlaggedComments()
    queryClient.setQueryData(['flagged-comments'], newFlaggedComments)

  }
  return (
    <div className={classNames.card}>
      <Column>
        <div>
          <div>
            <span className={classNames['label']}>Flagged Comment:</span>{' '}
            <span>
              #{comment.id}-{flag.id}
            </span>
            {
              snapshots.map((snapshot) => 
                <div key={snapshot.id} className={classNames['angryPaper']}>
              <RichTextDisplay richText={snapshot.richText} />
            </div>
              )
            }
            <div className={classNames['angryPaper']}>
              <RichTextDisplay richText={comment.richText} />
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
          <LoadingButton onClick={() => refuteFlag(flag.id).then(updateFlaggedComments)}>Okay</LoadingButton>
          <LoadingButton onClick={() => confirmFlag(flag.id).then(updateFlaggedComments)} variant="angry">
            Inappropriate
          </LoadingButton>
        </LeftRow>
        }
        
      </Column>
    </div>
  )
}
