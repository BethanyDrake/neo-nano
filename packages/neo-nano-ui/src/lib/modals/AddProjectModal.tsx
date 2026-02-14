'use client'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { ExtendableIconButton } from '../buttons/ExtendableIconButton'
import { useModalContext } from './ModalContext'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Modal } from './Modal'
import { AddEditProjectForm, ProjectDetails } from './AddEditProjectForm'
import { useMyProjectsContext } from '../projects/MyProjectContext'

export const ADD_PROJECT_MODAL = 'ADD_PROJECT_MODAL'
export const CREATE_PROJECT_ACTION = 'createProject'

export const AddProjectModal = () => {
  const { setOpenModal, closeModal } = useModalContext()
  const action = useSearchParams().get('action')

  const { isLoading, addProject } = useMyProjectsContext()
  const onSave = (projectDetails: ProjectDetails) => {
     addProject(projectDetails, { onSuccess: closeModal })
  }

  useEffect(() => {
    if (action === CREATE_PROJECT_ACTION) {
      setOpenModal(ADD_PROJECT_MODAL)
    }
  }, [action, setOpenModal])

  return (
    <>
      <ExtendableIconButton
        isLoading={isLoading}
        onClick={() => setOpenModal(ADD_PROJECT_MODAL)}
        text="add project"
        icon={faAdd}
      />
      <Modal modalId={ADD_PROJECT_MODAL}>
        <AddEditProjectForm
          onSave={onSave}
          mode={'add'}
          defaultValues={{
            title: '',
            blurb: '',
            visibility: 'private',
            status: 'planning',
            wordCount: '',
            excerpt: ''
          }}
        />
      </Modal>
    </>
  )
}
