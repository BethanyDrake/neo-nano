import { getQueryFunction } from '../_utils/getQueryFunction'
import { getThreadWithComments } from './getThreadWithComments'
import { vi } from 'vitest'
vi.mock('../_utils/getQueryFunction')

const someDate = new Date()
describe('getThreadWithComments', () => {
  test('comment with no flags', async () => {
    const comments = [
      {
        comment_text: 'comment text',
        rich_text: '<p>comment text</p>',
        created_at: someDate,
        author: '1',
        id: '2',
        thread: '5',
        display_name: 'Author Name',
        flags: [],
      },
    ]

    const thread = [{ title: 'Thread Title', author: '4', id: '5', topic: '6' }]
    const topic = [
      { id: '6', title: 'Topic Title', description: 'Topic description.', icon: 'fasLightning', category: '7' },
    ]
    const category = [{ id: '7', title: 'Category Title' }]

    const sql = vi.fn()

    // @ts-expect-error test
    vi.mocked(getQueryFunction).mockReturnValue(sql)
    sql.mockResolvedValueOnce(comments)
    sql.mockResolvedValueOnce([{ count: 1 }])
    sql.mockResolvedValueOnce([{ thread, topic, category }])

    expect(await getThreadWithComments('6')).toEqual(
      expect.objectContaining({
        commentCardDataEntries: [
          {
            comment: {
              text: 'comment text',
              id: '2',
              createdAt: someDate,
              richText: '<p>comment text</p>',
            },
            author: {
              id: '1',
              displayName: 'Author Name',
            },
            flags: [],
          },
        ],
        category: {
          id: '7',
          title: 'Category Title',
        },
        thread: {
          author: '4',
          id: '5',
          title: 'Thread Title',
          topic: '6',
        },
        topic: {
          category: '7',
          description: 'Topic description.',
          icon: 'fasLightning',
          id: '6',
          title: 'Topic Title',
        },
        totalComments: 1,
      }),
    )
  })

  test('comment with multiple flags', async () => {
    const comments = [
      {
        comment_text: 'comment text',
        author: '1',
        id: '2',
        thread: '5',
        display_name: 'Author Name',
        reason: 'harrasment',
        flags: [{ reason: 'harrassment' }, { reason: 'sexual-content' }],
      },
    ]

    const sql = vi.fn()
    // @ts-expect-error test
    vi.mocked(getQueryFunction).mockReturnValue(sql)
    sql.mockResolvedValueOnce(comments)
    sql.mockResolvedValueOnce([{ count: 1 }])
    sql.mockResolvedValueOnce([{ thread: [{}], topic: [{}], category: [{}] }])

    expect((await getThreadWithComments('6')).commentCardDataEntries).toEqual([
      {
        comment: {
          text: 'comment text',
          id: '2',
        },
        author: {
          id: '1',
          displayName: 'Author Name',
        },
        flags: [{ reason: 'harrassment' }, { reason: 'sexual-content' }],
      },
    ])
  })
})
