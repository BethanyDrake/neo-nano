import { fireEvent, render, waitFor } from '@testing-library/react'
import { ProjectSection } from './ProjectSection'
import { buildAspects } from './Project.type'
import { wrap } from 'souvlaki'
import { withReactQueryClient } from '@/tests/utils/withReactQueryClient'
import { deleteProject } from '../serverFunctions/projects/deleteProject'
vi.mock('@/lib/serverFunctions/projects/deleteProject')

describe('ProjectSection', () => {
  it('renders', () => {
    const { getByText } = render(
      <ProjectSection
        project={{
          id: '1',
          title: 'Some Title',
          blurb: 'Some blurb.',
          excerpt: 'Some exerpt.',
          wordCount: 50000,
          userId: '2',
          visibility: 'private',
          status: 'planning',
          aspects: buildAspects(),
        }}
      />,
      { wrapper: wrap(withReactQueryClient()) },
    )

    expect(getByText('Some Title')).toBeInTheDocument()
    fireEvent.click(getByText('Some Title'))
    expect(getByText('Some blurb.')).toBeInTheDocument()
    expect(getByText('Some exerpt.')).toBeInTheDocument()
    expect(getByText('50K')).toBeInTheDocument()
    expect(getByText('planning')).toBeInTheDocument()
    expect(getByText('private')).toBeInTheDocument()
  })

  test('delete project', async ()=> {
        const { getByText , getByRole} = render(
      <ProjectSection
        project={{
          id: '1',
          title: 'Some Title',
          blurb: '',
          excerpt: '',
          wordCount: 50000,
          userId: '2',
          visibility: 'private',
          status: 'planning',
          aspects: buildAspects(),
        }}
      />,
      { wrapper: wrap(withReactQueryClient()) },
    )

    fireEvent.click(getByText('Some Title'))
    fireEvent.click(getByRole('button', {name: 'delete project'}))
    await waitFor(() => {
      expect(deleteProject).toHaveBeenCalled()
    })
  })
})
