import Page from '@/app/forum/[topic-id]/[thread-id]/page'
import { render } from '@testing-library/react'
import { getThreadWithComments } from '@/lib/apiUtils/getThreadWithComments'

jest.mock('@/lib/apiUtils/getThreadWithComments')

describe('<ThreadPage />', () => {
  it('displays initial comments', async () => {
    jest.mocked(getThreadWithComments).mockResolvedValue({
      comments: [
        {
            text: 'some comment text',
            authorDisplayName: 'Some Name',
            author: undefined,
            id: 2,
            thread: undefined
        },
      ],
      category: {
          title: 'Some Category',
          id: 'some-category-id',
          topics: []
      },
      topic: {
          id: 'some-topic-id',
          title: 'Some Topic',
          description: '',
          icon: 'faBoltLightning',
          category: ''
      },
      thread: {
          title: 'Some Thread',
          id: 1,
          author: ''
      }
    })
    const {getByText} = render(await Page({ params: Promise.resolve({ 'thread-id': 'some-thread-id' }) }))

    expect(getByText(/some comment text/)).toBeInTheDocument()
        expect(getByText('Some Name')).toBeInTheDocument()

  })
})
