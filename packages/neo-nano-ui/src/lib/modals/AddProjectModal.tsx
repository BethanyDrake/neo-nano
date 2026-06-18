'use client'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { ExtendableIconButton } from '../buttons/ExtendableIconButton'
import { useModalContext } from './ModalContext'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Modal } from './Modal'
import { AddEditProjectForm, ProjectDetails } from './AddEditProjectForm'
import { createProject as _createProject } from '../serverFunctions/projects/createProject'
import { useMutation } from '@tanstack/react-query'
import { useMyProjects } from '../projects/useMyProjects'

export const ADD_PROJECT_MODAL = 'ADD_PROJECT_MODAL'
export const CREATE_PROJECT_ACTION = 'createProject'

export const AddProjectModal = () => {
  const { setOpenModal, closeModal } = useModalContext()
  const action = useSearchParams().get('action')

  const { isLoading } = useMyProjects()

    const { mutate: addProject, isPending } = useMutation({
    mutationFn: (projectDetails: ProjectDetails) => _createProject(projectDetails),
    onSuccess: (data, variables, onMutateResponse, context) => {
       context.client.invalidateQueries({ queryKey: ['my-projects'] })
       closeModal()
      },
  })

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
          onSave={addProject}
          mode={'add'}
          defaultValues={{
            title: '',
            blurb: '',
            visibility: 'private',
            status: 'planning',
            wordCount: '',
            excerpt: '',
            aspects: {
              fantasy: 0,
              mystery: 0,
              romance: 0,
              thrill: 0,
              complexity: 0
            }
          }}
          isPending={isPending}
        />
      </Modal>
    </>
  )
}
