import formClasses from '@/lib/expandableForms/form.module.css'
import { Profile } from '@/lib/types/forum.types'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BasicButton } from '../buttons/BasicButton'
import { ExtendableIconButton } from '../buttons/ExtendableIconButton'
import { useProfileContext } from '../context/ProfileContext'
import { Column, Row } from '../layoutElements/flexLayouts'
import { Modal } from './Modal'
import { useModalContext } from './ModalContext'

type Inputs = Pick<Profile, 'displayName' | 'aboutMe'>
const EDIT_PROFILE_MODAL = 'edit-profile-modal'

const EditProfileForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()
  const { updateProfile, isLoading, profile } = useProfileContext()
  const {  closeModal } = useModalContext()

  useEffect(() => {
    setValue('displayName', profile.displayName)
    setValue('aboutMe', profile.aboutMe)
  }, [profile, setValue])

  const _onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const body = {
      ...data,
    }

    updateProfile(body).then(() => {
      closeModal()
    })
  }

  return (
    <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
      <Column>
        <h2>Update Profile Details</h2>
        <Row alignItems="center" justifyContent="start">
          <label htmlFor="displayName">Display Name:</label>
          <input id="displayName" placeholder="Display Name" {...register('displayName', { required: true })} />
        </Row>
        {errors.displayName && <span className={formClasses.error}>^Please tell us what to call you.</span>}

        <label style={{ fontWeight: 'bold' }} htmlFor="aboutMe">
          About me:
        </label>
        <textarea id="aboutMe" placeholder="Favourite genres, writing experience, etc." {...register('aboutMe')} />
        <Row>
          <BasicButton buttonProps={{ onClick: closeModal }}>Cancel</BasicButton>{' '}
          <BasicButton isLoading={isLoading} buttonProps={{ type: 'submit' }}>
            Save
          </BasicButton>
        </Row>
      </Column>
    </form>
  )
}

export const EditProfileModal = () => {
  const { setOpenModal } = useModalContext()
  return (
    <>
      <ExtendableIconButton onClick={() => setOpenModal(EDIT_PROFILE_MODAL)} text="edit profile" icon={faEdit} />
      <Modal modalId={EDIT_PROFILE_MODAL}> <EditProfileForm/></Modal>
    </>
  )
}
