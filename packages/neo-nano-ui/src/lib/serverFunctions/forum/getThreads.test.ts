import { clearDb } from '@/tests/utils/clearDb'
import { getThreadSummaries } from './getThreads'
import { addCategory, addComment, addThread, addTopic, addUser, GENERAL_TOPIC } from '@/tests/utils/fillDb'
import { createThread } from './createThread'
import { getThreadWithComments } from './getThreadWithComments'
import { deleteComment } from './addThreadComment'
import { getUserId } from '../_utils/getUserIdFromSession'
import { flagComment } from '../moderation/flagComment'
import { getTopicSummary } from './getTopic'

// @vitest-environment node

vi.mock('../_utils/getUserIdFromSession')

describe('getThreads', () => {
  beforeEach(async () => {
    await clearDb()
    await addCategory()
    await addTopic()
  })

  test('no threads', async () => {

    const result = await getThreadSummaries(GENERAL_TOPIC, 1)
    expect(result).toEqual([])
  })

  it('gets threads with the initial comment', async () => {
    const user1 = await addUser({}, 'external-id')
    const user2 = await addUser({ displayName: 'Someone Else' })
    const threadId = await addThread({ author: user1 })
    await addComment(threadId, { author: user1, text: 'Comment 1 text.' })
    await addComment(threadId, { author: user2, text: 'Comment 2 text.' })
    const threadSummaries = await getThreadSummaries(GENERAL_TOPIC, 1)
    const topicSummary = await getTopicSummary(GENERAL_TOPIC)
    expect(threadSummaries).toHaveLength(1)
    expect(topicSummary.totalThreads).toEqual(1)
    expect(threadSummaries[0].text).toEqual('Comment 1 text.')
    expect(threadSummaries[0].totalComments).toEqual(2)
  })

  test('first comment is deleted', async () => {
    const userId = await addUser()
    vi.mocked(getUserId).mockResolvedValue(userId)
    const createdThreadId= await createThread({title: 'thread title', commentText: '', commentRichText: '', topic: GENERAL_TOPIC})

    const initialCommentId = (await getThreadWithComments(createdThreadId)).commentCardDataEntries[0].comment.id
    await deleteComment(initialCommentId)

    expect((await getThreadSummaries(GENERAL_TOPIC, 1))[0].removalStatus).toEqual("DELETED")
  })

  test('first comment is flagged', async () => {
    const userId = await addUser()
    vi.mocked(getUserId).mockResolvedValue(userId)
    const createdThreadId = await createThread({title: 'thread title', commentText: '', commentRichText: '', topic: GENERAL_TOPIC})
    const initialCommentId = (await getThreadWithComments(createdThreadId)).commentCardDataEntries[0].comment.id
    await flagComment({
      comment: initialCommentId,
      reason: 'harrassment',
      details: ''
    })

    expect((await getThreadSummaries(GENERAL_TOPIC, 1))[0].removalStatus).toEqual("PENDING_REVIEW")
  })
})
