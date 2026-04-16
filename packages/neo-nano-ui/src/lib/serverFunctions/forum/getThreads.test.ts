import { clearDb } from '@/tests/utils/clearDb'
import { getThreads } from './getThreads'
import { addCategory, addComment, addThread, addTopic, addUser, GENERAL_TOPIC } from '@/tests/utils/fillDb'
import { createThread } from './createThread'
import { getThreadWithComments } from './getThreadWithComments'
import { deleteComment } from './addThreadComment'
import { getUserId } from '../_utils/getUserIdFromSession'

// @vitest-environment node

vi.mock('../_utils/getUserIdFromSession')

describe('getThreads', () => {
  beforeEach(async () => {
    await clearDb()
    await addCategory()
    await addTopic()
  })

  test('no threads', async () => {

    const result = await getThreads(GENERAL_TOPIC)
    expect(result.threadSummaries).toEqual([])
    expect(result.totalThreads).toEqual('0')
  })

  it('gets threads with the initial comment', async () => {
    const user1 = await addUser({}, 'external-id')
    const user2 = await addUser({ displayName: 'Someone Else' })
    const threadId = await addThread({ author: user1 })
    await addComment(threadId, { author: user1, text: 'Comment 1 text.' })
    await addComment(threadId, { author: user2, text: 'Comment 2 text.' })
    const result = await getThreads(GENERAL_TOPIC)
    expect(result.threadSummaries).toHaveLength(1)
    expect(result.totalThreads).toEqual('1')
    expect(result.threadSummaries[0].text).toEqual('Comment 1 text.')
    expect(result.threadSummaries[0].totalComments).toEqual(2)
  })

  test('first comment is deleted', async () => {
    const userId = await addUser()
    vi.mocked(getUserId).mockResolvedValue(userId)
    await createThread({title: 'thread title', commentText: '', commentRichText: '', topic: GENERAL_TOPIC})
    const createdThreadId = (await getThreads(GENERAL_TOPIC)).threadSummaries[0].id
    const initialCommentId = (await getThreadWithComments(createdThreadId)).commentCardDataEntries[0].comment.id
    await deleteComment(initialCommentId)

    expect((await getThreads(GENERAL_TOPIC)).threadSummaries[0].isDeleted).toEqual(true)
  })
})
