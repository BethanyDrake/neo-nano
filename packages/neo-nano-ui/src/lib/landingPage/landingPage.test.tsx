import { render } from '@testing-library/react'
import LandingPage from '../../app/page'
import { vi } from 'vitest'
import { withReactQueryClient } from '@/tests/utils/withReactQueryClient'
import { wrap } from 'souvlaki'
import { getFeaturedProject } from '@/lib/serverFunctions/projects/getFeaturedProject'
import { buildProject } from '../projects/Project.type'
vi.mock('@auth0/nextjs-auth0', () => ({ useUser: () => ({}) }))
vi.mock('@/lib/ClientSideOnly', () => ({ ClientSideOnly: () => null }))
vi.mock('@/lib/serverFunctions/projects/getFeaturedProject')
describe('Langing Page', () => {
  it('renders', async () => {
    vi.mocked(getFeaturedProject).mockResolvedValue({
      user: { id: '1', displayName: 'Some Display Name' },
      project: buildProject(),
    })
    render(await LandingPage(), { wrapper: wrap(withReactQueryClient()) })
  })
})
