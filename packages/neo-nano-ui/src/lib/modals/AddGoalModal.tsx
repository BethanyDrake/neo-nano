import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { ExtendableIconButton } from '../buttons/ExtendableIconButton'
import { createGoal } from '../serverFunctions/goals/createGoal'
import { AddEditGoalForm, GoalDetails } from './AddEditGoalForm'
import classNames from './Modal.module.css'
import { useModalContext } from './ModalContext'
import { useMyGoalContext } from '../context/MyGoalsContext'

export const ADD_GOAL_MODAL = 'ADD_GOAL_MODAL'

export const AddGoalModal = () => {
  const {openModal, setOpenModal, closeModal} = useModalContext()
  const isOpen = openModal === ADD_GOAL_MODAL
 
  const { setGoals } = useMyGoalContext()
  const onSave = async (goalDetails: GoalDetails) => {
    const response = await createGoal(goalDetails)
    setGoals(response)
    closeModal()
  }

  return (
    <>
      <ExtendableIconButton onClick={() => setOpenModal(ADD_GOAL_MODAL)} text="add goal" icon={faAdd} />
      {isOpen && (
        <div className={classNames['modal']}>
          <AddEditGoalForm
            mode="add"
            defaultValues={{
              title: 'November 2025',
              lengthDays: '30',
              target: '50000',
              visibility: 'private',
              startDate: '2025-11-01',
              metric: 'words'
            }}
            closeModal={closeModal}
            onSave={onSave}
          />
        </div>
      )}
      {isOpen && <div className={classNames['modal-overlay']} />}
    </>
  )
}
