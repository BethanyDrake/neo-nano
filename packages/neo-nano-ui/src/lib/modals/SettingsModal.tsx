import { faCog } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { BasicButton } from '../buttons/BasicButton'
import { ExtendableIconButton } from '../buttons/ExtendableIconButton'
import { useFormSubmission } from '../buttons/usLoadableOnClick'
import { Column, LeftRow, Row } from '../layout'
import { updateEmailPreferences } from '../serverFunctions/settings/updateEmailPreferences'
import modalStyles from './Modal.module.css'
import { ModalOverlay, useModalContext } from './ModalContext'

export const SETTINGS_MODAL = 'SETTINGS_MODAL'

type Inputs = {
    recieveChallengeReminders: boolean,
    revieveEncouragmentEmails: boolean
}

const SettingsForm = () => {

   const { register, handleSubmit  } = useForm<Inputs>({defaultValues: {recieveChallengeReminders: false, revieveEncouragmentEmails: false}});
   const {closeModal} = useModalContext()

  const {onSubmit, isLoading} = useFormSubmission<Inputs>(async (data) => {
    console.log(data)
    await updateEmailPreferences(data)
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
        <span>remind me about upcoming challenges</span></Row></label>
       </LeftRow>

        <LeftRow>
        <label>
          <Row>
      <input type="checkbox" {...register('revieveEncouragmentEmails')} />
        <span>send me encouragement throughout the challenge</span></Row></label>
       </LeftRow>
       <LeftRow>

      </LeftRow>

      <BasicButton isLoading={isLoading} buttonProps={{type: "submit"}}>Save</BasicButton>
      </Column>
    </form>
  );
}

export const SettingsModal = () => {
  const { openModal, setOpenModal } = useModalContext()
  const isOpen = openModal === SETTINGS_MODAL
  return (
    <>
      <ExtendableIconButton text={'settings'} icon={faCog} onClick={() => setOpenModal(SETTINGS_MODAL)} />
      {isOpen && <div className={[modalStyles.modal, modalStyles.secondary].join(' ')}><SettingsForm/></div>}
      <ModalOverlay />
    </>
  )
}
