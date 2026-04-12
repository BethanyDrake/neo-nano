import { clearDb } from '@/tests/utils/clearDb'
import { getFlaggedComments } from './getFlaggedComments'
import { addCategory, addComment, addCommentSnapshot, addFlag, addThread, addTopic, addUser } from '@/tests/utils/fillDb'

// @vitest-environment node

describe('getFlaggedComments', () => {
  beforeEach(async () => {
    await clearDb()
  })

  test('no flagged comments', async () => {
    const result = await getFlaggedComments()
    expect(result).toEqual([])
  })

  test('comment with single flag', async () => {
    await addUser({ displayName: 'Author Name' })
    await addCategory()
    await addTopic()
    const threadId = await addThread()
    const commentId = await addComment(threadId, { text: 'Some comment' })
    await addFlag(commentId, { reason: 'harrassment' })

    const result = await getFlaggedComments()
    expect(result[0].comment.text).toEqual('Some comment')
    expect(result[0].flag.reason).toEqual('harrassment')
  })

    test('flagged comment with snapshots', async () => {
    await addUser({ displayName: 'Author Name' })
    await addCategory()
    await addTopic()
    const threadId = await addThread()
    const commentId = await addComment(threadId, { text: 'Some comment' })
    await addFlag(commentId, { reason: 'harrassment' })
    await addCommentSnapshot(commentId)

    const result = await getFlaggedComments()
    expect(result[0].snapshots).toHaveLength(1)
  })
})
