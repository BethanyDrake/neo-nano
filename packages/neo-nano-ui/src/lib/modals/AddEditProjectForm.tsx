import { SubmitHandler, useForm } from 'react-hook-form'
import { BasicButton } from '../buttons/BasicButton'
import formClasses from '@/lib/expandableForms/form.module.css'
import { Column, Row } from '../layoutElements/flexLayouts'
import { useModalContext } from './ModalContext'
import { Project, ProjectStatus } from '../projects/Project.type'
import { useMyProjectsContext } from '../projects/MyProjectContext'

type Inputs = Omit<Project, 'userId' | 'id' | 'wordCount'> & {wordCount: string}
export type ProjectDetails = Omit<Project, 'userId' | 'id'>

const statuses: ProjectStatus[] = ['planning', 'writing', 'editing', 'done']
export const AddEditProjectForm = ({ defaultValues, mode, onSave }: { mode: 'add' | 'edit'; defaultValues: Inputs,  onSave: (details: ProjectDetails) => void}) => {
  const { register, handleSubmit } = useForm<Inputs>({ defaultValues })
  const { closeModal } = useModalContext()
  const { isAddProjectPending } = useMyProjectsContext()
  const _onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const wordCount = data.wordCount ? parseInt(data.wordCount) : null
    onSave({
      ...data,
      wordCount
    })
  }

  return (
    <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
      <Column>
        <h2>{mode === 'add' ? 'Add Project' : 'Update Project'}</h2>
        <Row alignItems="center" justifyContent="start">
          <label htmlFor="title">Title:</label>
          <input id="title" placeholder="Title" {...register('title', { required: true })} />
        </Row>

        <label style={{ fontWeight: 'bold' }} htmlFor="blurb">
          Blurb:
        </label>
        <textarea style={{ height: '10em' }} id="blurb" {...register('blurb')} />

        <label style={{ fontWeight: 'bold' }} htmlFor="excerpt">
          Excerpt:
        </label>
        <textarea style={{ height: '10em' }} id="excerpt" {...register('excerpt')} />


        <label htmlFor="wordCount">Expected/final word count:</label>
        <input type="number" id="wordCount" placeholder="50000" {...register('wordCount')} />

        <Row alignItems="center" justifyContent="start">
          <label htmlFor="status">Status:</label>
          <select id="status" {...register('status', { required: true })}>
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </Row>
        <Row alignItems="center" justifyContent="start">
          <label htmlFor="visibility">Visibility:</label>
          <select id="visibility" {...register('visibility', { required: true })}>
            <option key="private" value="private">
              private
            </option>
            <option key="public" value="public">
              public
            </option>
          </select>
        </Row>

        <Row>
          <BasicButton buttonProps={{ type: 'button', onClick: closeModal }}>Cancel</BasicButton>{' '}
          <BasicButton isLoading={isAddProjectPending} buttonProps={{ type: 'submit' }}>
            Save
          </BasicButton>
        </Row>
      </Column>
    </form>
  )
}
