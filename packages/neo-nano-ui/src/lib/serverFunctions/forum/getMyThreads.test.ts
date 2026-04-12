import { clearDb } from "@/tests/utils/clearDb"
import { addCategory, addComment, addThread, addTopic, addUser } from "@/tests/utils/fillDb"
import { getExternalId } from "../_utils/getUserIdFromSession"
import { vi } from "vitest"
import { getMyThreads } from "./getMyThreads"
vi.mock('../_utils/getUserIdFromSession')

describe('getMyThreads', () => {
  beforeEach(async () => {
      await clearDb()
    })

  test('no threads', async () => {
    await addUser({}, 'external-id')
    vi.mocked(getExternalId).mockResolvedValue('external-id')

    const result = await getMyThreads()
    expect(result).toEqual([])
  })

  it('gets threads with the latest comment', async () => {
    const authorId = await addUser({}, 'external-id')
    const otherId = await addUser({displayName: "Someone Else"})
    vi.mocked(getExternalId).mockResolvedValue('external-id')
    await addCategory()
    await addTopic()
    const threadId = await addThread({author: authorId})
    await addComment(threadId, {author: authorId, text: "Comment 1 text."})
    await addComment(threadId, {author: otherId, text: "Comment 2 text."})
    const result = await getMyThreads()
    expect(result[0].totalComments).toEqual(2)
    expect(result[0].text).toEqual("Comment 2 text.")
    expect(result[0].authorDisplayName).toEqual("Someone Else")
  })
})