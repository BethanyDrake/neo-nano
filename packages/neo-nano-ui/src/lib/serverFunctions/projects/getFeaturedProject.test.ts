import { clearDb } from '@/tests/utils/clearDb'
import { addUser } from '@/tests/utils/fillDb'
import { getUserId } from '../_utils/getUserIdFromSession'
import { createProject } from './createProject'
import { buildAspects } from '@/lib/projects/Project.type'
import { FeaturedProjectResponse, getFeaturedProject } from './getFeaturedProject'
vi.mock('../_utils/getUserIdFromSession')

describe('getFeaturedProject', () => {
  beforeEach(async () => {
    await clearDb()
  })
  test('only one public project exists', async () => {
    const author = await addUser({ displayName: 'Some Display Name' })
    vi.mocked(getUserId).mockResolvedValue(author)
    await createProject({ title: 'Some title', visibility: 'public', status: 'writing', aspects: buildAspects() })
    const { project, user } = await getFeaturedProject() as FeaturedProjectResponse
    expect(project.title).toEqual('Some title')
    expect(user).toEqual({
      id: author,
      displayName: 'Some Display Name',
    })
  })
})
