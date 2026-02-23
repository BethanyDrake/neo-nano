import { fireEvent, render, waitFor } from '@testing-library/react'
import { withModalContext } from '@/tests/utils/withModalContext'
import { withReactQueryClient } from '@/tests/utils/withReactQueryClient'
import { withMyProjectContext } from '@/tests/utils/withMyProjectContext'
import { wrap } from 'souvlaki'
import { vi } from 'vitest'
import { getMyProjects } from '../serverFunctions/projects/getMyProjects'
import { buildProject } from '../projects/Project.type'
import { EditProjectModal } from './EditProjectModal'
import { updateProject } from '../serverFunctions/projects/updateProject'

vi.mock('@/lib/serverFunctions/projects/updateProject')
vi.mock('@/lib/serverFunctions/projects/getMyProjects')

describe('EditProjectModal', () => {
  beforeEach(() => {})
  test('upudate project title', async () => {
    const existingProject = buildProject({ title: 'Previous Title', blurb: 'Previous blurb.' })
    vi.mocked(getMyProjects).mockResolvedValue([existingProject])
    const { getByRole, queryByRole, findByRole } = render(
      <EditProjectModal initialProject={existingProject} />,
      {
        wrapper: wrap(withModalContext(), withReactQueryClient(), withMyProjectContext()),
      },
    )
    fireEvent.click(getByRole('button', { name: 'edit project' }))
    expect(await findByRole('heading', { name: 'Update Project' })).toBeInTheDocument()

    fireEvent.change(getByRole('textbox', { name: /Title/ }), { target: { value: 'New Title' } })

    fireEvent.click(getByRole('button', { name: /save/i }))
    await waitFor(() => {
      expect(queryByRole('heading', { name: 'Update Project' })).not.toBeInTheDocument()
    })
    expect(updateProject).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Title', blurb: 'Previous blurb.' }),
      expect.anything(),
    )
  })
})
