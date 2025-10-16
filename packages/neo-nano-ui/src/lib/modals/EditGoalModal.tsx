import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { SmallIconButton } from '../buttons/ExtendableIconButton'
import { useProfileContext } from '../context/ProfileContext'
import { Goal } from '../forum.types'
import { updateGoal } from '../serverFunctions/goals/updateGoal'
import { AddEditGoalForm, GoalDetails } from './AddEditGoalForm'
import classNames from './Modal.module.css'

export const EditGoalModal = ({ initialGoal }: { initialGoal: GoalDetails & Pick<Goal, 'id'> }) => {
  const [isOpen, setIsOpen] = useState(false)

  const { setGoals } = useProfileContext()
  const onSave = (goalDetails: GoalDetails) => {
    updateGoal(initialGoal.id, goalDetails).then((response) => {
      setGoals(response)
      setIsOpen(false)
    })
  }
  return (
    <>
      <SmallIconButton onClick={() => setIsOpen(true)} id="edit" icon={faEdit} text="edit goal" />
      {isOpen && (
        <div className={classNames['modal']}>
          <AddEditGoalForm
          mode='edit'
            defaultValues={{
              ...initialGoal,
              lengthDays: `${initialGoal.lengthDays}`,
              target: `${initialGoal.target}`,
            }}
            closeModal={() => setIsOpen(false)}
            onSave={onSave}
          />
        </div>
      )}
      {isOpen && <div className={classNames['modal-overlay']} />}
    </>
  )
}
