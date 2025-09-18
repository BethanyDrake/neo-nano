import { getThreadWithComments } from './getThreadWithComments'
import { getQueryFunction } from './getQueryFunction';

jest.mock('./getQueryFunction')

describe('getThreadWithComments', () => {
  test('comment with no flags', async () => {
    const queryResults = [
      [
        {
          comment_text: 'comment text',
          author: '1',
          id: '2',
          thread: '5',
          display_name: 'Author Name',
          flags: []
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

    // @ts-expect-error mocks
    jest.mocked(getQueryFunction).mockReturnValue(sql)
  


    // @ts-expect-error mock function
    expect(await getThreadWithComments('6', sql)).toEqual({
      commentCardDataEntries: [{
        comment: {
            text: 'comment text',
            id: '2',
        },
        author: {
          id: '1',
          displayName: 'Author Name'
        },
        flags: []
      }],
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



      test('comment with mulitple flags', async () => {
    const queryResults = [
      [
        {
          comment_text: 'comment text',
          author: '1',
          id: '2',
          thread: '5',
          display_name: 'Author Name',
          reason: "harrasment",
          flags: [{ "reason":"harrassment"}, {"reason":"sexual-content"}]
        }
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
    expect((await getThreadWithComments('6', sql)).commentCardDataEntries).toEqual([{
        comment: {
            text: 'comment text',
            id: '2',
        },
        author: {
          id: '1',
          displayName: 'Author Name'
        },
        flags: [{reason: "harrassment"}, {reason: "sexual-content"}]
      }],

    )
  })
})
