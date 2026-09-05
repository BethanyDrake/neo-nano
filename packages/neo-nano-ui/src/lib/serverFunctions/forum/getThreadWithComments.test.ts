import {
  addCategory,
  addComment,
  addThread,
  addTopic,
  addUser,
  GENERAL_CATEGORY,
  GENERAL_TOPIC,
} from '@/tests/utils/fillDb'
import { getThreadWithComments } from './getThreadWithComments'
import { clearDb } from '@/tests/utils/clearDb'
import { createThread } from './createThread'
import { getThreads } from './getThreads'
import { deleteComment } from './addThreadComment'
import { getUserId } from '../_utils/getUserIdFromSession'
import { flagComment } from '../moderation/flagComment'

// @vitest-environment node
vi.mock('../_utils/getUserIdFromSession')

describe('getThreadWithComments', () => {
  beforeEach(async () => {
    await clearDb()
  })
  test('comment with no flags', async () => {
    const author = await addUser({ displayName: 'Author Name' })
    await addCategory({ title: 'Category Title' })
    await addTopic({ title: 'Topic Title', description: 'Topic description.', icon: 'faBoltLightning' })
    const threadId = await addThread({ author, title: 'Thread Title' })
    const commentId = await addComment(threadId, { author, text: 'comment text', richText: '<p>comment text</p>' })

    expect(await getThreadWithComments(threadId)).toEqual(
      expect.objectContaining({
        commentCardDataEntries: [
          {
            comment: {
              text: 'comment text',
              id: commentId,
              createdAt: expect.anything(),
              richText: '<p>comment text</p>',
              removalStatus: null,
            },
            author: {
              id: author,
              displayName: 'Author Name',
            },
            snapshots: [],
          },
        ],
        category: {
          id: GENERAL_CATEGORY,
          title: 'Category Title',
        },
        thread: {
          author: parseInt(author),
          id: parseInt(threadId),
          title: 'Thread Title',
          topic: GENERAL_TOPIC,
          created_at: expect.anything(),
        },
        topic: {
          category: GENERAL_CATEGORY,
          description: 'Topic description.',
          icon: 'faBoltLightning',
          id: GENERAL_TOPIC,
          title: 'Topic Title',
        },
        totalComments: 1,
      }),
    )
  })

  test('initial comment is flagged', async () => {
    const authorId = await addUser({ displayName: 'Author Name' })
    await addCategory({ title: 'Category Title' })
    await addTopic({ title: 'Topic Title', description: 'Topic description.', icon: 'faBoltLightning' })
    const threadId = await addThread({ author: authorId, title: 'Thread Title' })
    const commentId = await addComment(threadId, {
      author: authorId,
      text: 'comment text',
      richText: '<p>comment text</p>',
    })
    await flagComment( { reason: 'harrassment', comment: commentId , details: '' })

    const { comment, author, snapshots } = (await getThreadWithComments(threadId)).commentCardDataEntries[0]
    expect(comment).toEqual(
      expect.objectContaining({
        text: 'comment text',
        id: commentId,
      }),
    )

    expect(author).toEqual(
      expect.objectContaining({
        id: authorId,
        displayName: 'Author Name',
      }),
    )
    expect(comment.removalStatus).toEqual('PENDING_REVIEW')
    expect(snapshots).toEqual([])
  })

   test('deleted initial comment', async () => {
    const author = await addUser()
    vi.mocked(getUserId).mockResolvedValue(author)
    await addCategory()
    await addTopic()
    await createThread({title: '', commentRichText: '', commentText: '', topic: GENERAL_TOPIC})

    const createdThreadId = (await getThreads(GENERAL_TOPIC)).threadSummaries[0].id
    const initialCommentId = (await getThreadWithComments(createdThreadId)).commentCardDataEntries[0].comment.id
    await deleteComment(initialCommentId)

    expect((await getThreadWithComments(createdThreadId)).removalStatus).toEqual('DELETED')
  })
})
