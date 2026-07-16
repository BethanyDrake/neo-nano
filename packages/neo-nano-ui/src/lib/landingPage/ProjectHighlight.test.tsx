import { render } from '@testing-library/react'
import { ProjectHighlight } from './ProjectHighlight'
import { buildProject } from '../projects/Project.type'
import { withReactQueryClient } from '@/tests/utils/withReactQueryClient'
import { wrap } from 'souvlaki'
vi.mock('../serverFunctions/projects/getFeaturedProject')

describe('ProjectHighlight', () => {
  it('renders', async () => {
    const { findByText, getByRole, getByText } = render(
      <ProjectHighlight
        user={{ id: '1', displayName: 'User Name' }}
        project={buildProject({ title: 'Project Title', blurb: 'Some blurb.' })}
      />,
      { wrapper: wrap(withReactQueryClient()) },
    )

    expect(await findByText('Featured Project: Project Title')).toBeInTheDocument()
    expect(getByText('Some blurb.')).toBeInTheDocument()
    expect(getByRole('link', { name: 'User Name' })).toBeInTheDocument()
  })
})
