import { clearDb } from "@/tests/utils/clearDb"
import { getRecentlyUpdatedThreads } from "./getRecentlyUpdatedThreads"
import { addCategory, addComment, addThread, addTopic, addUser } from "@/tests/utils/fillDb"
import { flagComment } from "../moderation/flagComment"
import { deleteComment } from "./addThreadComment"
import { getUserId } from "../_utils/getUserIdFromSession"

vi.mock("../_utils/getUserIdFromSession")

describe('getRecentlyUpdatedThreads', () => {
    beforeEach(async () => {
      await clearDb()
    })

  test('no threads', async () => {
    const result = await getRecentlyUpdatedThreads()
    expect(result).toEqual([])
  })

    it('gets threads with the latest comment', async () => {
    const authorId = await addUser({}, 'external-id')
    const otherId = await addUser({displayName: "Someone Else"})
    await addCategory()
    await addTopic()
    const threadId = await addThread({author: authorId})
    await addComment(threadId, {author: authorId, text: "Comment 1 text."})
    await addComment(threadId, {author: otherId, text: "Comment 2 text."})
    const result = await getRecentlyUpdatedThreads()
    expect(result[0].totalComments).toEqual(2)
    expect(result[0].text).toEqual("Comment 2 text.")
    expect(result[0].authorDisplayName).toEqual("Someone Else")
  })

   it('excludes comments that are deleted or flagged', async () => {
    const authorId = await addUser({displayName: "Someone"}, 'external-id')
    const otherId = await addUser({displayName: "Someone Else"})
    await addCategory()
    await addTopic()
    const threadId = await addThread({author: authorId})
    await addComment(threadId, {author: authorId, text: "Comment 1 text."})
    const commentToFlag = await addComment(threadId, {author: otherId, text: "Comment 2 text."})
    const commentToDelete = await addComment(threadId, {author: otherId, text: "Comment 3 text."})
    vi.mocked(getUserId).mockResolvedValue(authorId)
    await flagComment( { reason: 'harrassment', comment: commentToFlag , details: '' })
    vi.mocked(getUserId).mockResolvedValue(otherId)
    await deleteComment(commentToDelete)
    const result = await getRecentlyUpdatedThreads()
    console.log(result)
    expect(result[0].totalComments).toEqual(3)
    expect(result[0].text).toEqual("Comment 1 text.")
    expect(result[0].authorDisplayName).toEqual("Someone")
  })
})