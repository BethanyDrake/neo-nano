import { SubmitHandler, useForm } from 'react-hook-form'
import { BasicButton } from '../buttons/BasicButton'
import { useProfileContext } from '../context/ProfileContext'
import formClasses from '../form.module.css'
import { Goal, Visibility } from '../forum.types'
import { Column, Row } from '../layout'

type Inputs = {
    title: string
    // yyyy-MM-dd
    startDate: string
    lengthDays: string
    target: string
    visibility: Visibility
}

export type GoalDetails = Pick<Goal, "title" | "target" | "lengthDays" | "startDate" | 'visibility'>

export const AddEditGoalForm = ({ defaultValues, closeModal, mode, onSave }: {mode: 'add' | 'edit', defaultValues: Inputs, closeModal: () => void , onSave: (goalDetails: GoalDetails) => void}) => {
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>({defaultValues
  })
  const { isLoading } = useProfileContext()

  const _onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const body = {
      ...data,
        lengthDays: parseInt(data.lengthDays),
        target: parseInt(data.target),
    
    }
    onSave(body)
  }

  return (
    <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
      <Column>
        <h2>{mode === 'add' ? 'Add Goal' : 'Update Goal'}</h2>
        <Row alignItems="center" justifyContent="start">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            placeholder="Title"
            {...register('title', { required: true })}
          />
        </Row>

        <Row alignItems="center" justifyContent="start">
          <label htmlFor="length">Duration:</label>
          <input
          disabled={mode==='edit'}
            type="number"
            min={1}
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
            id="target"
            placeholder="50000"
            {...register('target', { required: true })}
          />{' '}
          <span>words</span>
        </Row>

        <Row alignItems="center" justifyContent="start">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
      disabled={mode==='edit'}
            id="startDate"
            placeholder="start date"
            {...register('startDate', { required: true })}
          />
        </Row>

        <Row alignItems="center" justifyContent="start">
          <label htmlFor="visibility">Visibility:</label>
          <select id="visibility"  {...register('visibility', { required: true })}>
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