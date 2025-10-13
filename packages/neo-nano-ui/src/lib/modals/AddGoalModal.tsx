import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BasicButton } from '../buttons/BasicButton'
import { ExtendableIconButton } from '../buttons/ExtendableIconButton'
import { useProfileContext } from '../context/ProfileContext'
import formClasses from '../form.module.css'
import { Visibility } from '../forum.types'
import { Column, Row } from '../layout'
import { createGoal } from '../serverFunctions/goals/createGoal'
import classNames from './Modal.module.css'

type Inputs = {
    title: string
    // yyyy-MM-dd
    startDate: string
    lengthDays: string
    target: string
    visibility: Visibility
}

const CreateGoalForm = ({ closeModal }: { closeModal: () => void }) => {
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>()
  const { setGoals, isLoading } = useProfileContext()


  const _onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const body = {
      ...data,
        lengthDays: parseInt(data.lengthDays),
        target: parseInt(data.target)
    }

    createGoal(body).then((response) => {
      setGoals(response)
      closeModal()
    })
  }

  return (
    <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
      <Column>
        <h2>Add Goal</h2>
        <Row alignItems="center" justifyContent="start">
          <label htmlFor="title">Title:</label>
          <input
            defaultValue={'November 2025'}
            id="title"
            placeholder="Title"
            {...register('title', { required: true })}
          />
        </Row>

        <Row alignItems="center" justifyContent="start">
          <label htmlFor="length">Duration:</label>
          <input
            type="number"
            min={1}
            defaultValue={30}
            id="length"
            placeholder="0"
            {...register('lengthDays', { required: true })}
          />{' '}
          <span>days</span>
        </Row>

        <Row alignItems="center" justifyContent="start">
          <label htmlFor="target">Target Word Count:</label>
          <input
            type="number"
            min={1}
            defaultValue={50000}
            id="target"
            placeholder="50000"
            {...register('target', { required: true })}
          />{' '}
          <span>days</span>
        </Row>

        <Row alignItems="center" justifyContent="start">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            defaultValue={'2025-11-01'}
            id="startDate"
            placeholder="start date"
            {...register('startDate', { required: true })}
          />
        </Row>

        <Row alignItems="center" justifyContent="start">
          <label htmlFor="visibility">Visibility:</label>
          <select id="visibility" defaultValue="private" {...register('visibility', { required: true })}>
            <option key="private" value="private">
              private
            </option>
            <option key="public" value="public">
              public
            </option>
          </select>
        </Row>

        <Row>
          <BasicButton buttonProps={{ onClick: closeModal }}>Cancel</BasicButton>{' '}
          <BasicButton isLoading={isLoading} buttonProps={{ type: 'submit' }}>
            Save
          </BasicButton>
        </Row>
      </Column>
    </form>
  )
}

export const AddGoalModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <ExtendableIconButton onClick={() => setIsOpen(true)} text="add goal" icon={faAdd} />
      {isOpen && (
        <div className={classNames['modal']}>
          <CreateGoalForm closeModal={() => setIsOpen(false)} />
        </div>
      )}
      {isOpen && <div className={classNames['modal-overlay']} />}
    </>
  )
}
