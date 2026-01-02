import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { faFontAwesomeFlag } from '@fortawesome/free-solid-svg-icons/faFontAwesomeFlag'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BasicButton } from '../buttons/BasicButton'
import { SmallIconButton } from '../buttons/ExtendableIconButton'
import { useThreadContext } from '../context/ThreadContext'
import formClasses from '@/lib/styles/forum.module.css'
import { Comment, Flag } from '@/lib/types/forum.types'
import { Column, LeftRow, Row } from '../layoutElements/flexLayouts'
import { flagComment } from '../serverFunctions/moderation/flagComment'
import classNames from './Modal.module.css'
import { useModalContext } from './ModalContext'
import { Modal } from './Modal'
type Inputs = Pick<Flag, 'reason' | 'details'>

const ReportCommentForm = ({
  comment,
}: {
  comment: Pick<Comment, 'id' | 'text'>
}) => {
  const {closeModal } = useModalContext()
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
          </BasicButton>
          <BasicButton isLoading={isLoading} variant="angry" buttonProps={{ type: 'submit' }}>
            Save
          </BasicButton>
        </Row>
      </Column>
    </form>
  )
}

export const ReportCommentModal = ({ comment }: { comment: Pick<Comment, 'id' | 'text'> }) => {
  const modalId = `ReportCommentModal-${comment.id}`
   const { setOpenModal } = useModalContext()

  return (
    <>
    <SmallIconButton onClick={() => setOpenModal(modalId)} id={'report'} text={'Report comment as inappropriate'} variant="angry" icon={faFontAwesomeFlag} />
      <Modal variant="angry" modalId={modalId}>
          <ReportCommentForm comment={comment} />
        </Modal>
    </>
  )
}
