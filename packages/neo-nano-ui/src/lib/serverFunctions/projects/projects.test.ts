import { addUser } from '@/tests/utils/fillDb'
import { getUserId } from '../_utils/getUserIdFromSession'
import { clearDb } from '@/tests/utils/clearDb'
import { createProject } from './createProject'
import { buildAspects, buildProject } from '@/lib/projects/Project.type'
import { getMyProjects } from './getMyProjects'
import { getPublicProjects } from './getPublicProjects'
import { updateProject } from './updateProject'
import { deleteProject } from './deleteProject'
// @vitest-environment node
vi.mock('../_utils/getUserIdFromSession')

describe('projects', () => {
  let author: string
  beforeEach(async () => {
    await clearDb()
    author = await addUser()
    vi.mocked(getUserId).mockResolvedValue(author)
  })
  test('create a project', async () => {
    await createProject({ title: 'Some title', visibility: 'private', status: 'writing', aspects: buildAspects() })
    const myProjects = await getMyProjects()
    expect(myProjects).toHaveLength(1)
    expect(myProjects[0]).toEqual({
      id: expect.anything(),
      userId: author,
      title: 'Some title',
      blurb: null,
      excerpt: null,
      wordCount: null,
      visibility: 'private',
      status: 'writing',
      aspects: { romance: 0, mystery: 0, thrill: 0, complexity: 0, fantasy: 0 },
    })
  })

  test('private project', async () => {
    await createProject(buildProject({ visibility: 'private' }))

    const myProjects = await getMyProjects()
    expect(myProjects).toHaveLength(1)
    const publicProjects = await getPublicProjects(author)
    expect(publicProjects).toHaveLength(0)
  })

  test('public project', async () => {
    await createProject(buildProject({ visibility: 'public' }))

    const myProjects = await getMyProjects()
    expect(myProjects).toHaveLength(1)
    const publicProjects = await getPublicProjects(author)
    expect(publicProjects).toHaveLength(1)
  })

  test('update project', async () => {
    const createdProject = await createProject(buildProject({ title: 'Old Title' }))
    await updateProject({
      id: createdProject.id,
      title: 'Updated Title',
      visibility: 'public',
      status: 'writing',
      aspects: buildAspects({ romance: 100 }),
    })
    const myProjects = await getMyProjects()

    console.log(myProjects)
    expect(myProjects[0]).toEqual({
      id: createdProject.id,
      userId: author,
      title: 'Updated Title',
      blurb: null,
      excerpt: null,
      wordCount: null,
      visibility: 'public',
      status: 'writing',
      aspects: { romance: 100, mystery: 0, thrill: 0, complexity: 0, fantasy: 0 },
    })
  })

  test('delete project', async () => {
    const createdProject = await createProject(buildProject({ visibility: 'private' }))

    expect(await getMyProjects()).toHaveLength(1)
    await deleteProject(createdProject.id)

    expect(await getMyProjects()).toHaveLength(0)
  })
})
