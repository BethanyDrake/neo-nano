import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BasicButton } from '../buttons/BasicButton'
import { useThreadContext } from '../context/ThreadContext'
import formClasses from '@/lib/expandableForms/form.module.css'
import { Flag } from '@/lib/types/forum.types'
import { Column, LeftRow, Row } from '../layoutElements/flexLayouts'
import { flagComment } from '../serverFunctions/moderation/flagComment'
import classNames from './Modal.module.css'
import { useCommentActionContext, useCommentCardContext } from '../commentCards/CommentCard'
type Inputs = Pick<Flag, 'reason' | 'details'>

const ReportCommentForm = () => {
  const { updateCommentsData } = useThreadContext()
  const { comment, author } = useCommentCardContext()
  const { cancelAction } = useCommentActionContext()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const [isLoading, setIsloading] = useState(false)

  const _onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    setIsloading(true)
    await flagComment({
      ...data,
      comment: comment.id,
    })
    await updateCommentsData()
    setIsloading(false)
    cancelAction()
  }

  return (
    <form className={[formClasses.form, formClasses.angry].join(' ')} onSubmit={handleSubmit(_onSubmit)}>
      <Column>
        <h2>Report {author.displayName}&apos;s comment as inappropriate:</h2>
        <fieldset className={classNames['reason-fieldset']}>
          <legend>Reason:</legend>

          <Column gap="4px">
            <LeftRow>
              <input
                id="sexual-content"
                {...register('reason', { required: true })}
                type="radio"
                value="sexual-content"
              />
              <label htmlFor="sexual-content">sexual content</label>
            </LeftRow>
            <LeftRow>
              <input id="harrassment" {...register('reason', { required: true })} type="radio" value="harrassment" />
              <label htmlFor="harrassment">harrassment</label>
            </LeftRow>
            <LeftRow>
              <input id="spam" {...register('reason', { required: true })} type="radio" value="spam" />
              <label htmlFor="spam">spam</label>
            </LeftRow>
            <LeftRow>
              <input id="other" {...register('reason', { required: true })} type="radio" value="other" />
              <label htmlFor="other">other</label>
            </LeftRow>
            {errors.reason && (
              <span className={formClasses.error}>
                <FontAwesomeIcon icon={faCircleExclamation} /> Must select a reason.
              </span>
            )}
          </Column>
        </fieldset>
        <label htmlFor="details">More details:</label>
        <input
          id="details"
          type="text"
          placeholder="This comment is innappropriate because..."
          {...register('details')}
        />

        <Row>
          <BasicButton variant="angry" buttonProps={{ onClick: cancelAction }}>
            Cancel
          </BasicButton>
          <BasicButton isLoading={isLoading} variant="angry" buttonProps={{ type: 'submit' }}>
            Save
          </BasicButton>
        </Row>
      </Column>
    </form>
  )
}

export const ReportCommentWrapper = () => {
  return (
        <div
          ref={(node) => node?.scrollIntoView?.({ block: 'end', behavior: 'smooth' })}
          style={{
            border: '2px dashed var(--angry-vibrant)',
            borderLeft: 'none',
            borderRight: 'none',
            paddingTop: '24px',
            paddingBottom: '24px',
          }}
        >
          <ReportCommentForm />
        </div>
  )
}
