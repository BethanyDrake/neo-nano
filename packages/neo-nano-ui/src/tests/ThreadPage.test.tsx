import Page from '@/app/forum/[topic-id]/[thread-id]/page'
import { buildThreadSummary } from '@/lib/forum.builders'
import { getThreadWithComments } from '@/lib/serverFunctions/forum/getThreadWithComments'
import { render } from '@testing-library/react'

jest.mock('@/lib/serverFunctions/forum/getThreadWithComments')
jest.mock('@/lib/serverFunctions/forum/getThreadReactions', () => ({getThreadReactions: () => Promise.resolve({})}))

describe('<ThreadPage />', () => {
  it('displays initial comments', async () => {
    jest.mocked(getThreadWithComments).mockResolvedValue({
      totalComments: 1,
      commentCardDataEntries: [
        {
          comment: {
            text: 'some comment text',
            richText: '<p>some rich text</p>',
            id: '2',
            createdAt: new Date()
          },
          author: {
            id: '1',
            displayName: 'Some Name',
          },
          flags: [],
        },
      ],
      category: {
        title: 'Some Category',
        id: 'some-category-id',
      },
      topic: {
        id: 'some-topic-id',
        title: 'Some Topic',
        description: '',
        icon: 'faBoltLightning',
        category: '',
      },
      thread: buildThreadSummary()
    })
    const { findByText } = render(await Page({ params: Promise.resolve({ 'thread-id': 'some-thread-id' }) }))

    expect(await findByText(/some rich text/)).toBeInTheDocument()
    expect(await findByText(/Some Name/)).toBeInTheDocument()
  })
})
