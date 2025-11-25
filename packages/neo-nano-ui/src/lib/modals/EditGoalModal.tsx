import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { SmallIconButton } from '../buttons/ExtendableIconButton'
import { Goal } from '@/lib/types/forum.types'
import { updateGoal } from '../serverFunctions/goals/updateGoal'
import { AddEditGoalForm, GoalDetails } from './AddEditGoalForm'
import classNames from './Modal.module.css'
import { useMyGoalContext } from '../context/MyGoalsContext'
import { minutesToHours } from 'date-fns'

export const EditGoalModal = ({ initialGoal }: { initialGoal: GoalDetails & Pick<Goal, 'id'> }) => {
  const [isOpen, setIsOpen] = useState(false)

  const { setGoals } = useMyGoalContext()
  const onSave = async (goalDetails: GoalDetails) => {
    const response = await updateGoal(initialGoal.id, goalDetails)
    setGoals(response)
    setIsOpen(false)
  }

  const metric = initialGoal.metric === 'minutes' ? 'hours' : initialGoal.metric

  const target = initialGoal.metric === 'minutes' ? minutesToHours(initialGoal.target) : initialGoal.target

  return (
    <>
      <SmallIconButton onClick={() => setIsOpen(true)} id="edit" icon={faEdit} text="edit goal" />
      {isOpen && (
        <div className={classNames['modal']}>
          <AddEditGoalForm
            mode="edit"
            defaultValues={{
              ...initialGoal,
              lengthDays: `${initialGoal.lengthDays}`,
              target: `${target}`,
              metric,
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
