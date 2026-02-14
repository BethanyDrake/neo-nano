import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { SmallIconButton } from '../buttons/ExtendableIconButton'
import { Modal } from './Modal'
import { useModalContext } from './ModalContext'
import { Project } from '../projects/Project.type'
import { useMyProjectsContext } from '../projects/MyProjectContext'
import { AddEditProjectForm, ProjectDetails } from './AddEditProjectForm'

const EDIT_PROJECT_MODAL = 'edit-project-modal'

export const EditProjectModal = ({ initialProject }: { initialProject: Project}) => {
  const { setOpenModal, closeModal } = useModalContext()

  const { updateProject} = useMyProjectsContext()
  const onSave = async (projectDetails: ProjectDetails) => {
    updateProject({id: initialProject.id, ...projectDetails}, {onSuccess: closeModal})
  }

  return (
    <>
      <SmallIconButton onClick={() => setOpenModal(EDIT_PROJECT_MODAL)} id="edit" icon={faEdit} text="edit project" />
      <Modal modalId={EDIT_PROJECT_MODAL}>
        <AddEditProjectForm
          mode="edit"
          defaultValues={{
            ...initialProject,
            wordCount: initialProject.wordCount ? `${initialProject.wordCount}`: ''
            
          }}
          onSave={onSave}
        />
      </Modal>
    </>
  )
}
