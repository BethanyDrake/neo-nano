import { render } from '@testing-library/react'
import { buildAspects } from './Project.type'
import { wrap } from 'souvlaki'
import { withReactQueryClient } from '@/tests/utils/withReactQueryClient'
import { PublicProjectSection } from './PublicProjectSection'
vi.mock('@/lib/serverFunctions/projects/deleteProject')

describe('PublicProjectSection', () => {
  it('renders', () => {
    const { getByText } = render(
      <PublicProjectSection
        project={{
          id: '1',
          title: 'Some Title',
          blurb: 'Some blurb.',
          excerpt: 'Some exerpt.',
          wordCount: 50000,
          userId: '2',
          visibility: 'public',
          status: 'planning',
          aspects: buildAspects(),
        }}
      />,
      { wrapper: wrap(withReactQueryClient()) },
    )

    expect(getByText('Some Title')).toBeInTheDocument()
    expect(getByText('Some blurb.')).toBeInTheDocument()
    expect(getByText('Some exerpt.')).toBeInTheDocument()
    expect(getByText('50K')).toBeInTheDocument()
    expect(getByText('planning')).toBeInTheDocument()
  })
})
