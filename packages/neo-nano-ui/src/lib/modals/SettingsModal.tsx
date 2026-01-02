import { faCog } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { BasicButton } from '../buttons/BasicButton'
import { ExtendableIconButton } from '../buttons/ExtendableIconButton'
import { useFormSubmission } from '../buttons/usLoadableOnClick'
import { Column, LeftRow, Row } from '../layoutElements/flexLayouts'
import { EmailPreferences, updateEmailPreferences } from '../serverFunctions/settings/updateEmailPreferences'
import { useModalContext } from './ModalContext'
import { useState, useEffect } from 'react'
import { getEmailPreferences } from '../serverFunctions/settings/getEmailPreferences'
import { Modal } from './Modal'

export const SETTINGS_MODAL = 'SETTINGS_MODAL'

const SettingsForm = ({
  initialValues,
  setInitialFormState,
}: {
  initialValues: EmailPreferences
  setInitialFormState: (updatedValues: EmailPreferences) => void
}) => {
  const { register, handleSubmit } = useForm<EmailPreferences>({ defaultValues: initialValues })
  const { closeModal } = useModalContext()

  const { onSubmit, isLoading: isSubmitting } = useFormSubmission<EmailPreferences>(async (data) => {
    await updateEmailPreferences(data)
    setInitialFormState(data)
    closeModal()
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Column>
        <h2>Settings</h2>
        <LeftRow>
          <label>
            <Row>
              <input type="checkbox" {...register('recieveChallengeReminders')} />
              <span>remind me about upcoming challenges</span>
            </Row>
          </label>
        </LeftRow>

        <LeftRow>
          <label>
            <Row>
              <input type="checkbox" {...register('revieveEncouragmentEmails')} />
              <span>send me encouragement throughout the challenge</span>
            </Row>
          </label>
        </LeftRow>
        <LeftRow></LeftRow>

        <BasicButton isLoading={isSubmitting} buttonProps={{ type: 'submit' }}>
          Save
        </BasicButton>
      </Column>
    </form>
  )
}

export const SettingsModal = () => {
  const { setOpenModal } = useModalContext()
  const [initialValues, setInitialValues] = useState<EmailPreferences>()

  useEffect(() => {
    getEmailPreferences().then(setInitialValues)
  }, [])
  return (
    <>
      <ExtendableIconButton
        isLoading={!initialValues}
        text={'settings'}
        icon={faCog}
        onClick={() => setOpenModal(SETTINGS_MODAL)}
      />
      {initialValues && (
        <Modal modalId={SETTINGS_MODAL} variant='secondary'>
          <SettingsForm setInitialFormState={setInitialValues} initialValues={initialValues} />
        </Modal>
      )}
    </>
  )
}
