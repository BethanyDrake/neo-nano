import { addCategory, addComment, addFlag, addThread, addTopic, addUser, GENERAL_CATEGORY, GENERAL_TOPIC } from '@/tests/utils/fillDb'
import { getThreadWithComments } from './getThreadWithComments'
import { clearDb } from '@/tests/utils/clearDb'

describe('getThreadWithComments', () => {
  beforeEach(async () => {
    await clearDb()
  })
  test('comment with no flags', async () => {

    const author = await addUser({displayName: 'Author Name'})
    await addCategory({title: "Category Title",})
    await addTopic({title: "Topic Title", description: "Topic description.", icon: 'faBoltLightning'})
    const threadId = await addThread({author, title: "Thread Title"})
    const commentId = await addComment(threadId, {author, text: 'comment text', richText: '<p>comment text</p>'})

    expect(await getThreadWithComments(threadId)).toEqual(
      expect.objectContaining({
        commentCardDataEntries: [
          {
            comment: {
              text: 'comment text',
              id: commentId,
              createdAt: expect.anything(),
              richText: '<p>comment text</p>',
              isDeleted: false
            },
            author: {
              id: author,
              displayName: 'Author Name',
            },
            flags: [],
            snapshots: []
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
          created_at: expect.anything()
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

  test('comment with multiple flags', async () => {

    const author = await addUser({displayName: 'Author Name'})
    await addCategory({title: "Category Title",})
    await addTopic({title: "Topic Title", description: "Topic description.", icon: 'faBoltLightning'})
    const threadId = await addThread({author, title: "Thread Title"})
    const commentId = await addComment(threadId, {author, text: 'comment text', richText: '<p>comment text</p>'})
    await addFlag(commentId, {reason: 'harrassment'})
    await addFlag(commentId, {reason: 'sexual-content'})

    expect((await getThreadWithComments(threadId)).commentCardDataEntries).toEqual([
      {
        comment: expect.objectContaining({
          text: 'comment text',
          id: commentId,
        }),
        author: {
          id: author,
          displayName: 'Author Name',
        },
        flags: [expect.objectContaining({ reason: 'harrassment' }), expect.objectContaining({ reason: 'sexual-content' })],
        snapshots: []
      },
    ])
  })
})
