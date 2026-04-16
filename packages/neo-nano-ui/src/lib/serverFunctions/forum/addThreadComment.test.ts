import { addCategory, addTopic, addUser, GENERAL_TOPIC } from '@/tests/utils/fillDb'
import { createThread } from './createThread'
import { getUserId } from '../_utils/getUserIdFromSession'
import { vi } from 'vitest'
import { clearDb } from '@/tests/utils/clearDb'
import { getThreadWithComments } from './getThreadWithComments'
import { deleteComment } from './addThreadComment'
import { getThreads } from './getThreads'
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
    const result = await createThread({
      title: 'Thread Title',
      topic: GENERAL_TOPIC,
      commentText: 'Some comment text.',
      commentRichText: '<p>Some comment text.</p>',
    })
    const createdThread = result.threadSummaries[0].id
    expect(result.threadSummaries[0].isDeleted).toEqual(false)
    const initialCommentId = (await getThreadWithComments(createdThread)).commentCardDataEntries[0].comment.id
    console.log({initialCommentId})
    await deleteComment(initialCommentId)
    const updatedThreads = await getThreads(GENERAL_TOPIC)
    expect(updatedThreads.threadSummaries[0].isDeleted).toEqual(true)
  })
})
