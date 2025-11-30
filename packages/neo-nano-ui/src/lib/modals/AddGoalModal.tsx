'use client'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { ExtendableIconButton } from '../buttons/ExtendableIconButton'
import { createGoal } from '../serverFunctions/goals/createGoal'
import { AddEditGoalForm, GoalDetails } from './AddEditGoalForm'
import classNames from './Modal.module.css'
import { useModalContext } from './ModalContext'
import { useMyGoalContext } from '../context/MyGoalsContext'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export const ADD_GOAL_MODAL = 'ADD_GOAL_MODAL'
export const CREATE_GOAL_ACTION = 'createGoal'

export const AddGoalModal = () => {
  const {openModal, setOpenModal, closeModal} = useModalContext()
  const isOpen = openModal === ADD_GOAL_MODAL
  const action = useSearchParams().get("action")

  useEffect(() => {
    if (action === CREATE_GOAL_ACTION) {
      setOpenModal(ADD_GOAL_MODAL)
    }
    
  }, [action, setOpenModal])
 
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
