import { getThreadWithComments } from './getThreadWithComments'

describe('getThreadWithComments', () => {
  test('happy path', async () => {
    const queryResults = [
      [
        {
          comment_text: 'comment text',
          author: '1',
          id: '2',
          thread: '3',
          display_name: 'Author Name',
        },
      ],
      [{ title: 'Thread Title', author: '4', id: '5', topic: '6' }],
      [{ id: '6', title: 'Topic Title', description: 'Topic description.', icon: 'fasLightning', category: '7' }],
      [{ id: '7', title: 'Category Title' }],
    ]

    const sql = jest
      .fn()
      .mockResolvedValueOnce(queryResults[0])
      .mockResolvedValueOnce(queryResults[1])
      .mockResolvedValueOnce(queryResults[2])
      .mockResolvedValueOnce(queryResults[3])
  


    // @ts-expect-error mock function
    expect(await getThreadWithComments('6', sql)).toEqual({
      category: {
        id: '7',
        title: 'Category Title',
      },
      comments: [
        {
          author: '1',
          authorDisplayName: 'Author Name',
          id: '2',
          text: 'comment text',
          thread: '3',
        },
      ],
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
})
