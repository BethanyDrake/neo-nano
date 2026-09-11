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

type Inputs = Pick<Profile, 'displayName' | 'aboutMe' | 'links'>
const EDIT_PROFILE_MODAL = 'edit-profile-modal'

const InputRow = ({
  id,
  label,
  placeholder,
  props,
}: {
  id: string
  label: string
  placeholder: string
  props: Record<string, unknown>
}) => {
  return (
    <Row alignItems="center" justifyContent="start">
      <label htmlFor={id}>{label}:</label>
      <input id={id} placeholder={placeholder} {...props} />
    </Row>
  )
}

const EditProfileForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()
  const { updateProfile, isLoading, profile } = useProfileContext()
  const { closeModal } = useModalContext()

  useEffect(() => {
    setValue('displayName', profile.displayName)
    setValue('aboutMe', profile.aboutMe)
    if (profile.links) {
      // @ts-ignore
      Object.entries(profile.links).forEach(([key, value]) => {setValue(`links.${key}`, value)})
    }
  }, [profile, setValue])

  const _onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const body = {
      ...data,
    }
    console.log("body", body)
    updateProfile(body, { onSuccess: closeModal })
  }

  return (
    <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
      <Column>
        <h2>Update Profile Details</h2>
        <InputRow
          id="displayName"
          label="Display Name"
          placeholder="Display Name"
          props={register('displayName', { required: true })}
        />
        {errors.displayName && <span className={formClasses.error}>^Please tell us what to call you.</span>}

        <label style={{ fontWeight: 'bold' }} htmlFor="aboutMe">
          About me:
        </label>
        <textarea id="aboutMe" placeholder="Favourite genres, writing experience, etc." {...register('aboutMe')} />
        <section>
          <h3>Links:</h3>
        </section>
        <InputRow id="links.wattpad" label="Wattpad" placeholder="wattpad-id" props={register('links.wattpad')} />
        <InputRow id="links.substack" label="Substack" placeholder="@substack-id" props={register('links.substack')} />
        <InputRow id="links.ao3" label="AO3" placeholder="ao3-id" props={register('links.ao3')} />
        <InputRow id="links.bluesky" label="Bluesky" placeholder="@bluesky-id" props={register('links.bluesky')} />
        
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
      <Modal modalId={EDIT_PROFILE_MODAL}>
        <EditProfileForm />
      </Modal>
    </>
  )
}
