import { addCategory, addTopic, addUser, GENERAL_TOPIC } from '@/tests/utils/fillDb'
import { createThread } from './createThread'
import { getUserId } from '../_utils/getUserIdFromSession'
import { vi } from 'vitest'
import { clearDb } from '@/tests/utils/clearDb'

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
    const result = await createThread({
      title: 'Thread Title',
      topic: GENERAL_TOPIC,
      commentText: 'Some comment text.',
      commentRichText: '<p>Some comment text.</p>',
    })
    expect(result.threadSummaries[0]).toEqual({
      author: authorId,
      authorDisplayName: 'Author Name',
      comment_text: 'Some comment text.',
      count: '1',
      created_at: expect.anything(),
      display_name: 'Author Name',
      id: expect.anything(),
      latest: expect.anything(),
      text: 'Some comment text.',
      title: 'Thread Title',
      topic: GENERAL_TOPIC,
      totalComments: 1,
    })
  })
})
