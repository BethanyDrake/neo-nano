import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { SmallIconButton } from '../buttons/ExtendableIconButton'
import { Goal } from '@/lib/types/forum.types'
import { updateGoal } from '../serverFunctions/goals/updateGoal'
import { AddEditGoalForm, GoalDetails } from './AddEditGoalForm'
import { useMyGoalContext } from '../context/MyGoalsContext'
import { minutesToHours } from 'date-fns'
import { Modal } from './Modal'
import { useModalContext } from './ModalContext'

const EDIT_GOAL_MODAL = 'edit-goal-modal'

export const EditGoalModal = ({ initialGoal }: { initialGoal: GoalDetails & Pick<Goal, 'id'> }) => {
  const { setOpenModal, closeModal } = useModalContext()

  const { setGoals } = useMyGoalContext()
  const onSave = async (goalDetails: GoalDetails) => {
    const response = await updateGoal(initialGoal.id, goalDetails)
    setGoals(response)
    closeModal()
  }

  const metric = initialGoal.metric === 'minutes' ? 'hours' : initialGoal.metric

  const target = initialGoal.metric === 'minutes' ? minutesToHours(initialGoal.target) : initialGoal.target

  return (
    <>
      <SmallIconButton onClick={() => setOpenModal(EDIT_GOAL_MODAL)} id="edit" icon={faEdit} text="edit goal" />
      <Modal modalId={EDIT_GOAL_MODAL}>
        <AddEditGoalForm
          mode="edit"
          defaultValues={{
            ...initialGoal,
            lengthDays: `${initialGoal.lengthDays}`,
            target: `${target}`,
            metric,
          }}
          onSave={onSave}
        />
      </Modal>
    </>
  )
}
