import { SubmitHandler, useForm } from 'react-hook-form'
import classNames from './Modal.module.css'
import { BasicButton } from '../buttons/BasicButton'
import { Column, Row } from '../layout'
import { useState } from 'react'
import { Profile } from '../forum.types'
import { ExtendableIconButton } from '../buttons/ExtendableIconButton'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import formClasses from '../form.module.css'
import { updateProfile } from '../serverFunctions/profile/updateProfile'

type Inputs = {
  displayName: string
  aboutMe: string
}

const EditProfileForm = ({
  closeModal,
  onUpdate,
}: {
  closeModal: () => void
  onUpdate: (updatedProfile: Profile) => void
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const _onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const body = {
      ...data,
    }

    updateProfile(body).then((updatedProfile) => {
      onUpdate(updatedProfile)
      closeModal()
    })
  }

  return (
    <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
      <Column>
        <h2>Update Profile Details</h2>
        <Row alignItems="center" justifyContent="start">
          <label htmlFor="displayName">
            Display Name:
          </label>
          <input id="displayName" placeholder="Display Name" {...register('displayName', {required: true})}/>
         
        </Row>
         {errors.displayName && <span className={formClasses.error}>^Please tell us what to call you.</span>}
        

        <label style={{ fontWeight: 'bold' }} htmlFor="aboutMe">
          About me:
        </label>
        <input
          id="aboutMe"
          placeholder="Favourite genres, writing experience, etc."
          {...register('aboutMe')}
        />
        <Row>
          <BasicButton buttonProps={{ onClick: closeModal }}>Cancel</BasicButton>{' '}
          <BasicButton buttonProps={{ type: 'submit' }}>Save</BasicButton>
        </Row>
      </Column>
    </form>
  )
}

export const EditProfileModal = ({ onUpdate }: { onUpdate: (updatedProfile: Profile) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <ExtendableIconButton onClick={() => setIsOpen(true)} text="edit profile" icon={faEdit} />
      {isOpen && (
         <div className={classNames['modal']}>
          <EditProfileForm onUpdate={onUpdate} closeModal={() => setIsOpen(false)} />
        </div>
      )}
      {isOpen && <div className={classNames['modal-overlay']} />}
    </>
  )
}
