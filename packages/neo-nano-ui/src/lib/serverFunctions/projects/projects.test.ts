import { addUser } from "@/tests/utils/fillDb"
import { getUserId } from "../_utils/getUserIdFromSession"
import { clearDb } from "@/tests/utils/clearDb"
import { createProject } from "./createProject"
import { buildAspects } from "@/lib/projects/Project.type"
import { getMyProjects } from "./getMyProjects"
// @vitest-environment node
vi.mock('../_utils/getUserIdFromSession')

describe('projects', () => {

    let author
      beforeEach(async () => {
        await clearDb()
        author = await addUser()
        vi.mocked(getUserId).mockResolvedValue(author)
      })
    test('create a private project', async () => {
        await createProject({title: "Some title", visibility: 'private', status: 'writing', aspects: buildAspects()})
        const myProjects = await getMyProjects()
        expect(myProjects).toHaveLength(1)
    })

})