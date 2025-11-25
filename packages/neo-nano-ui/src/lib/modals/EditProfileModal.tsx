import { SubmitHandler, useForm } from 'react-hook-form'
import classNames from './Modal.module.css'
import { BasicButton } from '../buttons/BasicButton'
import { Column, Row } from '../layoutElements/flexLayouts'
import { useEffect, useState } from 'react'
import { Profile } from '@/lib/types/forum.types'
import { ExtendableIconButton } from '../buttons/ExtendableIconButton'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import formClasses from '@/lib/expandableForms/form.module.css'
import { useProfileContext } from '../context/ProfileContext'

type Inputs = Pick<Profile, 'displayName' | 'aboutMe'>

const EditProfileForm = ({ closeModal }: { closeModal: () => void }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()
  const { updateProfile, isLoading, profile } = useProfileContext()

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
        <input id="aboutMe" placeholder="Favourite genres, writing experience, etc." {...register('aboutMe')} />
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
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <ExtendableIconButton onClick={() => setIsOpen(true)} text="edit profile" icon={faEdit} />
      {isOpen && (
        <div className={classNames['modal']}>
          <EditProfileForm closeModal={() => setIsOpen(false)} />
        </div>
      )}
      {isOpen && <div className={classNames['modal-overlay']} />}
    </>
  )
}
