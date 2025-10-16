import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { ExtendableIconButton } from '../buttons/ExtendableIconButton'
import { useProfileContext } from '../context/ProfileContext'
import { createGoal } from '../serverFunctions/goals/createGoal'
import { AddEditGoalForm, GoalDetails } from './AddEditGoalForm'
import classNames from './Modal.module.css'

export const AddGoalModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { setGoals } = useProfileContext()
  const onSave = (goalDetails: GoalDetails) => {
    createGoal(goalDetails).then((response) => {
      setGoals(response)
      setIsOpen(false)
    })
  }

  return (
    <>
      <ExtendableIconButton onClick={() => setIsOpen(true)} text="add goal" icon={faAdd} />
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
