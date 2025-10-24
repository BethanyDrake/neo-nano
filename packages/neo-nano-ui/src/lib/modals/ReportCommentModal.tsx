import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BasicButton } from '../buttons/BasicButton'
import formClasses from '../form.module.css'
import { Comment, Flag } from '../forum.types'
import { Column, LeftRow, Row } from '../layout'
import classNames from './Modal.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFontAwesomeFlag } from '@fortawesome/free-solid-svg-icons/faFontAwesomeFlag'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { useThreadContext } from '../context/ThreadContext'
import { flagComment } from '../serverFunctions/moderation/flagComment'
type Inputs = Pick<Flag, 'reason' | 'details'>

const ReportCommentForm = ({
  closeModal,
  comment,
}: {
  closeModal: () => void
  comment: Pick<Comment, 'id' | 'text'>
}) => {
  const { updateCommentsData } = useThreadContext()
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
    closeModal()
  }
 
  return (
    <form className={[formClasses.form, formClasses.angry].join(' ')} onSubmit={handleSubmit(_onSubmit)}>
      <Column>
        <h2>Report Comment as Inappropriate</h2>
        <p className={classNames['comment']}>{comment.text}</p>
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
              <label htmlFor="sexual-conent">sexual content</label>
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
          <BasicButton variant="angry" buttonProps={{ onClick: closeModal }}>
            Cancel
          </BasicButton>{' '}
          <BasicButton isLoading={isLoading} variant="angry" buttonProps={{ type: 'submit' }}>
            Save
          </BasicButton>
        </Row>
      </Column>
    </form>
  )
}

export const ReportCommentModal = ({ comment }: { comment: Pick<Comment, 'id' | 'text'> }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button
        title="Report comment as inappropriate"
        onClick={() => {
          setIsOpen(true)
        }}
        className={classNames.flag}
      >
        <FontAwesomeIcon icon={faFontAwesomeFlag} />
      </button>
      {isOpen && (
        <div className={[classNames['modal'], classNames['angry']].join(' ')}>
          <ReportCommentForm comment={comment} closeModal={() => setIsOpen(false)} />
        </div>
      )}
      {isOpen && <div className={[classNames['modal-overlay'], classNames.angry].join(' ')} />}
    </>
  )
}
