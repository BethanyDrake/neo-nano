import { ReturnType } from '@/app/api/threads/route'
import { Category, Topic } from '@/lib/forum.types'
import TopicPage from '@/pages/forum/[topic-id]'
import { fireEvent, render } from '@testing-library/react'
import axios from 'axios'
import { NextPageContext } from 'next'
import { mockRequest } from './utils/mswHelpers'

jest.spyOn(axios, 'post')
jest.mock('@/lib/useRequireLogin')

describe('<TopicPage />', () => {
  beforeEach(() => {
    mockRequest('get', '/undefined/api/topic', {
      topic: {},
      category: {}
    })
    mockRequest('get', '/undefined/api/threads', {
      threads: []
      
    })
})
  it('displays existing threads', async () => {
    mockRequest<ReturnType>('get', '/undefined/api/threads', {
      threads: [{ id: 1, title: 'Existing Topic 1', author: 'some-author', text: 'First comment text' }],
      
    })
    const context: Partial<NextPageContext> = { query: { ['topic-id']: 'someTopic' } }
    const initalProps = await TopicPage.getInitialProps(context as NextPageContext)

    const { getByText } = render(<TopicPage {...initalProps} />)
    expect(getByText('Existing Topic 1')).toBeInTheDocument()
    expect(getByText('First comment text')).toBeInTheDocument()
  })

  test('breadcumbs: category > topic', async () => {
    mockRequest('get', '/undefined/api/topic', {
      topic: { id: 'topic-id', title: 'Some Topic' },
      category: { id: 'category-id', title: 'Some Category' },
    })
    mockRequest<ReturnType>('get', '/undefined/api/threads', {
      threads: [],
    })
    const context: Partial<NextPageContext> = { query: { ['topic-id']: 'someTopic' } }
    const initalProps = await TopicPage.getInitialProps(context as NextPageContext)

    const { getByText } = render(<TopicPage {...initalProps} />)
    expect(getByText('Some Category')).toBeInTheDocument()
    expect(getByText('Some Topic')).toBeInTheDocument()
  })

  test('add new thread', async () => {
    mockRequest('post', '/api/threads', null)
    mockRequest<ReturnType>('get', '/api/threads', {
      threads: [{ id: 1, title: 'New Thread Title', author: 'some-author', text: 'First comment text' }],
    })

    const { getByRole, findByLabelText, getByLabelText, findByText } = render(
      <TopicPage category={{} as Category} topic={{ id: 'someTopic' } as Topic} initialThreads={[]} />,
    )

    const button = getByRole('button', { name: 'Create Thread' })

    expect(button).toBeInTheDocument()
    fireEvent.click(button)

    fireEvent.change(await findByLabelText(/Title/), { target: { value: 'New Thread Title' } })
    fireEvent.change(getByLabelText(/Comment/), { target: { value: 'Some comment' } })
    fireEvent.click(getByRole('button', { name: 'Post!' }))

    expect(await findByText('New Thread Title')).toBeInTheDocument()

    expect(axios.post).toHaveBeenCalledWith(expect.anything(), {
      title: 'New Thread Title',
      commentText: 'Some comment',
      topic: 'someTopic',
    })
  })
})
