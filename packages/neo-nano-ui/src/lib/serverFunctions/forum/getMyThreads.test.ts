import { clearDb } from '@/tests/utils/clearDb'
import { addCategory, addComment, addThread, addTopic, addUser } from '@/tests/utils/fillDb'
import { getExternalId, getUserId } from '../_utils/getUserIdFromSession'
import { vi } from 'vitest'
import { getMyThreads } from './getMyThreads'
import { deleteComment } from './addThreadComment'
import { flagComment } from '../moderation/flagComment'
// @vitest-environment node

vi.mock('../_utils/getUserIdFromSession')
vi.mock('../_utils/getUserId')

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
    const otherId = await addUser({ displayName: 'Someone Else' })
    vi.mocked(getExternalId).mockResolvedValue('external-id')
    await addCategory()
    await addTopic()
    const threadId = await addThread({ author: authorId })
    await addComment(threadId, { author: authorId, text: 'Comment 1 text.' })
    await addComment(threadId, { author: otherId, text: 'Comment 2 text.' })
    const result = await getMyThreads()
    expect(result[0].totalComments).toEqual(2)
    expect(result[0].text).toEqual('Comment 2 text.')
    expect(result[0].authorDisplayName).toEqual('Someone Else')
  })

  it('gets threads with the latest non-deleted comment', async () => {
    const authorId = await addUser({}, 'external-id')
    const otherId = await addUser({ displayName: 'Someone Else' })
    vi.mocked(getExternalId).mockResolvedValue('external-id')
    await addCategory()
    await addTopic()
    const threadId = await addThread({ author: authorId })
    await addComment(threadId, { author: authorId, text: 'Comment 1 text.' })
    await addComment(threadId, { author: otherId, text: 'Comment 2 text.' })
    const commentToDelete = await addComment(threadId, { author: otherId, text: 'Comment 3 text.' })
    const commentToFlag = await addComment(threadId, { author: otherId, text: 'Comment 4 text.' })
    vi.mocked(getUserId).mockResolvedValue(otherId)
    await deleteComment(commentToDelete)
    await flagComment({ comment: commentToFlag, reason: 'spam', details: '' })
    const result = await getMyThreads()
    expect(result[0].totalComments).toEqual(4)
    expect(result[0].text).toEqual('Comment 2 text.')
    expect(result[0].authorDisplayName).toEqual('Someone Else')
  })

  test('removal status is based on the initial comment', async () => {
    const authorId = await addUser({}, 'external-id')
    const otherId = await addUser({ displayName: 'Someone Else' })
    vi.mocked(getExternalId).mockResolvedValue('external-id')
    vi.mocked(getUserId).mockResolvedValue(authorId)
    await addCategory()
    await addTopic()
    const threadId = await addThread({ author: authorId })
    const initialComment = await addComment(threadId, { author: authorId, text: 'Comment 1 text.' })
    await addComment(threadId, { author: otherId, text: 'Comment 2 text.' })

    await deleteComment(initialComment)
    const result = await getMyThreads()
    expect(result[0].totalComments).toEqual(2)
    expect(result[0].removalStatus).toEqual('DELETED')
  })
})
