import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { SmallIconButton } from '../buttons/ExtendableIconButton'
import { Modal } from './Modal'
import { useModalContext } from './ModalContext'
import { Project } from '../projects/Project.type'
import { AddEditProjectForm, ProjectDetails } from './AddEditProjectForm'
import { updateProject as _updateProject }from '../serverFunctions/projects/updateProject'
import { useMutation } from '@tanstack/react-query'

export const EditProjectModal = ({ initialProject }: { initialProject: Project}) => {
  const { setOpenModal, closeModal } = useModalContext()

   const { mutate: onSave, isPending } = useMutation({
      mutationFn: (projectDetails: ProjectDetails) => _updateProject({id: initialProject.id, ...projectDetails}),
      onSuccess: (data, variables, onMutateResponse, context) => {
       context.client.invalidateQueries({ queryKey: ['my-projects'] })
       closeModal()
      },
    })
  const modalId = `edit-project-modal-${initialProject.id}`
  return (
    <>
      <SmallIconButton onClick={() => setOpenModal(modalId)} id="edit" icon={faEdit} text="edit project" />
      <Modal modalId={modalId}>
        <AddEditProjectForm
          mode="edit"
          defaultValues={{
            ...initialProject,
            wordCount: initialProject.wordCount ? `${initialProject.wordCount}`: ''
            
          }}
          isPending={isPending}
          onSave={(details) => onSave(details)}
        />
      </Modal>
    </>
  )
}
