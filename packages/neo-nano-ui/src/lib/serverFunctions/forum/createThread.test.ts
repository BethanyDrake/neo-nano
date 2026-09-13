import { addCategory, addTopic, addUser, GENERAL_TOPIC } from '@/tests/utils/fillDb'
import { createThread } from './createThread'
import { getUserId } from '../_utils/getUserIdFromSession'
import { vi } from 'vitest'
import { clearDb } from '@/tests/utils/clearDb'
import { getThreadSummaries } from './getThreads'
// @vitest-environment node
vi.mock('../_utils/getUserIdFromSession')

describe('createThread', () => {
  beforeEach(async () => {
    await clearDb()
  })
  test('creats a thread and an initial comment', async () => {
    const authorId = await addUser({ displayName: 'Author Name' })
    vi.mocked(getUserId).mockResolvedValue(authorId)
    await addCategory()
    await addTopic()
    await createThread({
      title: 'Thread Title',
      topic: GENERAL_TOPIC,
      commentText: 'Some comment text.',
      commentRichText: '<p>Some comment text.</p>',
    })

    expect((await getThreadSummaries(GENERAL_TOPIC, 1))[0]).toEqual({
      author: authorId,
      authorDisplayName: 'Author Name',
      id: expect.anything(),
      latest: expect.anything(),
      text: 'Some comment text.',
      title: 'Thread Title',
      topic: GENERAL_TOPIC,
      totalComments: 1,
      removalStatus: null
    })
  })
})
