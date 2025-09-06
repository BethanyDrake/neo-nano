import { SubmitHandler, useForm } from 'react-hook-form'
import classNames from './Modal.module.css'
import axios from 'axios'
import { BasicButton } from './buttons/BasicButton'
import { Column, Row } from './layout'
import { useState } from 'react'
import { Profile } from './forum.types'
import { ExtendableIconButton } from './buttons/ExtendableIconButton'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

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

    await axios.post(`/api/profile`, body).then((response) => {
      const updatedProfile = response.data.profile
      onUpdate(updatedProfile)
      closeModal()
    })
  }

  return (
    <form onSubmit={handleSubmit(_onSubmit)}>
      <Column>
        <h2>Update Profile Details</h2>
        <Row justifyContent="start">
          <label style={{ fontWeight: 'bold' }} htmlFor="displayName">
            Display Name:
          </label>
          <input id="displayName" placeholder="Display Name" {...register('displayName')} required={true} />
        </Row>

        <label style={{ fontWeight: 'bold' }} htmlFor="aboutMe">
          About me:
        </label>
        <input
          id="aboutMe"
          placeholder="Favourite genres, writing experience, etc."
          {...register('aboutMe')}
          required={true}
        />

        {errors.displayName && <span>This field is required</span>}
        <Row>
          {' '}
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
