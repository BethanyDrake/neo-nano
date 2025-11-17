import { faCog } from '@fortawesome/free-solid-svg-icons'
import { ExtendableIconButton } from '../buttons/ExtendableIconButton'
import { ModalOverlay, useModalContext } from './ModalContext'
import modalStyles from './Modal.module.css'
import { useForm } from 'react-hook-form'
import { Column, LeftRow } from '../layout'
import { BasicButton } from '../buttons/BasicButton'
import { useLoadableOnClick } from '../buttons/usLoadableOnClick'

export const SETTINGS_MODAL = 'SETTINGS_MODAL'

type Inputs = {
    recieveChallengeReminders: boolean,
    revieveEncouragmentEmails: boolean
}

const SettingsForm = () => {

   const { register, handleSubmit } = useForm<Inputs>({defaultValues: {recieveChallengeReminders: false, revieveEncouragmentEmails: false}});
  const {onClick: onSubmit, isLoading} = useLoadableOnClick(() => {
    console.log("Updating preferences...")
    return Promise.resolve()
  })
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Column>
      <h2>Settings</h2>
      <LeftRow>
      <input type="checkbox" {...register('recieveChallengeReminders')} />
       <label htmlFor="recieveChallengeReminders">remind me about upcoming challenges</label>
       </LeftRow>
       <LeftRow>
<input type="checkbox" {...register('revieveEncouragmentEmails')} />
     <label htmlFor="revieveEncouragmentEmails">send me encouragement throughout the challenge</label>

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
