import { fireEvent, render, waitFor } from '@testing-library/react'
import { AddProjectModal } from './AddProjectModal'
import { wrap } from 'souvlaki'
import { withModalContext } from '@/tests/utils/withModalContext'
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'
import { createProject } from '../serverFunctions/projects/createProject'
import { withReactQueryClient } from '@/tests/utils/withReactQueryClient'
import { withMyProjectContext } from '@/tests/utils/withMyProjectContext'
import { getMyProjects } from '../serverFunctions/projects/getMyProjects'
import { Project } from '../projects/Project.type'
import { vi } from 'vitest'

vi.mock('@/lib/serverFunctions/projects/createProject')
vi.mock('@/lib/serverFunctions/projects/getMyProjects')
vi.mock('@/lib/projects/AspectInput')
describe('AddProjectModal', () => {
  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue({ get: vi.fn() } as unknown as ReadonlyURLSearchParams)
    vi.mocked(getMyProjects).mockResolvedValue([])
    vi.mocked(createProject).mockResolvedValue({} as Project)
  })

  test('addProject', async () => {
    const { getByRole, queryByRole } = render(<AddProjectModal />, {
      wrapper: wrap(withModalContext(), withReactQueryClient(), withMyProjectContext()),
    })
    await waitFor(() => {
      expect(getByRole('button', { name: 'add project' })).toBeEnabled()
    })

    fireEvent.click(getByRole('button', { name: 'add project' }))
    expect(getByRole('heading', { name: 'Add Project' }))

    fireEvent.change(getByRole('textbox', { name: /Title/ }), { target: { value: 'Some Title' } })
    fireEvent.change(getByRole('textbox', { name: /Blurb/ }), { target: { value: 'Some blurb' } })
    fireEvent.change(getByRole('textbox', { name: /Excerpt/ }), { target: { value: 'Some exerpt' } })
    fireEvent.change(getByRole('spinbutton', { name: /word count/ }), { target: { value: '50000' } })

    fireEvent.change(getByRole('combobox', { name: /Status/ }), { target: { value: 'writing' } })
    fireEvent.change(getByRole('combobox', { name: /Visibility/ }), { target: { value: 'public' } })

    fireEvent.click(getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(queryByRole('heading', { name: 'Add Project' })).not.toBeInTheDocument()
    })
    expect(createProject).toHaveBeenCalledWith(
      {
        blurb: 'Some blurb',
        excerpt: 'Some exerpt',
        status: 'writing',
        title: 'Some Title',
        visibility: 'public',
        wordCount: 50000,
        aspects: {
          mystery: 0,
          fantasy:0,
          thrill: 0,
          romance: 0,
          complexity: 0
        }
      },
      expect.anything(),
    )
  })
})
