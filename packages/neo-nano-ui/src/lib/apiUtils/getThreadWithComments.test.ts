import { mockQueryFunction } from '@/tests/utils/mockQueryFunction'
import { getQueryFunction } from './getQueryFunction'
import { getThreadWithComments } from './getThreadWithComments'
jest.mock('./getQueryFunction')

describe('getThreadWithComments', () => {
  test('comment with no flags', async () => {
    const comments = [
      {
        comment_text: 'comment text',
        author: '1',
        id: '2',
        thread: '5',
        display_name: 'Author Name',
        flags: [],
      },
    ]

    const threads = [{ title: 'Thread Title', author: '4', id: '5', topic: '6' }]
    const topics = [
      { id: '6', title: 'Topic Title', description: 'Topic description.', icon: 'fasLightning', category: '7' },
    ]
    const categories = [{ id: '7', title: 'Category Title' }]

    mockQueryFunction(jest.mocked(getQueryFunction), {
      comments,
      threads,
      topics,
      categories,
    })

    expect(await getThreadWithComments('6')).toEqual({
      commentCardDataEntries: [
        {
          comment: {
            text: 'comment text',
            id: '2',
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
    })
  })

  test('comment with multiple flags', async () => {
    const comments =
      [
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
    const threads =  [{ title: 'Thread Title', author: '4', id: '5', topic: '6' }]
    const topics=  [{ id: '6', title: 'Topic Title', description: 'Topic description.', icon: 'fasLightning', category: '7' }]
    const categories =  [{ id: '7', title: 'Category Title' }]

    mockQueryFunction(jest.mocked(getQueryFunction), {
      comments,
      threads,
      topics,
      categories,
    })
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
