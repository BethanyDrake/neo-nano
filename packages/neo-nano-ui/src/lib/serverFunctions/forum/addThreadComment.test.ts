import { addCategory, addTopic, addUser, GENERAL_TOPIC } from '@/tests/utils/fillDb'
import { createThread } from './createThread'
import { getUserId } from '../_utils/getUserIdFromSession'
import { vi } from 'vitest'
import { clearDb } from '@/tests/utils/clearDb'
import { getThreadWithComments } from './getThreadWithComments'
import { deleteComment } from './addThreadComment'
import { getThreadSummaries } from './getThreads'
// @vitest-environment node
vi.mock('../_utils/getUserIdFromSession')

describe('createThread', () => {
  beforeEach(async () => {
    await clearDb()
  })
  test('create thread then delete the initial comment ', async () => {
    const authorId = await addUser({ displayName: 'Author Name' })
    vi.mocked(getUserId).mockResolvedValue(authorId)
    await addCategory()
    await addTopic()
    const createdThread = await createThread({
      title: 'Thread Title',
      topic: GENERAL_TOPIC,
      commentText: 'Some comment text.',
      commentRichText: '<p>Some comment text.</p>',
    })
    const threadSummaries = await getThreadSummaries(GENERAL_TOPIC, 1)
    expect(threadSummaries[0].removalStatus).toEqual(null)
    const initialCommentId = (await getThreadWithComments(createdThread)).commentCardDataEntries[0].comment.id
    console.log({initialCommentId})
    await deleteComment(initialCommentId)
    const updatedThreadSummaries = await getThreadSummaries(GENERAL_TOPIC, 1)
    expect(updatedThreadSummaries[0].removalStatus).toEqual('DELETED')
  })
})
