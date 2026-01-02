'use client'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { ExtendableIconButton } from '../buttons/ExtendableIconButton'
import { createGoal } from '../serverFunctions/goals/createGoal'
import { AddEditGoalForm, challengeToInputs, GoalDetails } from './AddEditGoalForm'
import { useModalContext } from './ModalContext'
import { useMyGoalContext } from '../context/MyGoalsContext'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import {  getCurrentChallenge, getUpcomingChallenge } from '../challenges'
import { Modal } from './Modal'

export const ADD_GOAL_MODAL = 'ADD_GOAL_MODAL'
export const CREATE_GOAL_ACTION = 'createGoal'

export const AddGoalModal = () => {
  const { setOpenModal, closeModal } = useModalContext()
  const action = useSearchParams().get('action')

  const defaultChallenge = getCurrentChallenge() ?? getUpcomingChallenge()

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
        <Modal modalId={ADD_GOAL_MODAL}> 
          <AddEditGoalForm
            mode="add"
            defaultValues={
              defaultChallenge
                ? challengeToInputs(defaultChallenge, 'private')
                : {
                    title: '',
                    startDate: '',
                    lengthDays: '',
                    target: '',
                    visibility: 'private',
                    metric: 'words',
                  }
            }
            onSave={onSave}
          />
     </Modal>
   
    </>
  )
}
