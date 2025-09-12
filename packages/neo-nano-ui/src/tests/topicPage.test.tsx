import { ReturnType } from '@/app/api/threads/route'
import { Category, Topic } from '@/lib/forum.types'
import TopicPage from '@/app/forum/[topic-id]/page'
import { fireEvent, render } from '@testing-library/react'
import axios from 'axios'
import { mockRequest } from './utils/mswHelpers'
import { getThreads } from "@/lib/apiUtils/getThreads"
import { getTopic } from "@/lib/apiUtils/getTopic"
import { auth0 } from "@/lib/auth0"
import { SessionData } from '@auth0/nextjs-auth0/types'

jest.spyOn(axios, 'post')
jest.mock('@/lib/useRequireLogin')
jest.mock('@/lib/apiUtils/getThreads')
jest.mock('@/lib/apiUtils/getTopic')

describe('<TopicPage />', () => {
  beforeEach(() => {
    jest.mocked(getTopic).mockResolvedValue({
      topic: { } as Topic,
      category: {} as Category,
    })
    jest.mocked(getThreads).mockResolvedValue([])
})
  it('displays existing threads', async () => {
    jest.mocked(getThreads).mockResolvedValue([{ id: 1, title: 'Existing Topic 1', author: 'some-author', text: 'First comment text' }])

    const { getByText } = render(await TopicPage({params: Promise.resolve({"topic-id" : "someTopic"})}))
    expect(getByText('Existing Topic 1')).toBeInTheDocument()
    expect(getByText('First comment text')).toBeInTheDocument()
  })

  test('breadcumbs: category > topic', async () => {
    jest.mocked(getTopic).mockResolvedValue({
      topic: { id: 'topic-id', title: 'Some Topic' } as Topic,
      category: { id: 'category-id', title: 'Some Category' } as Category,
    })


    const { getByText } = render(await TopicPage({params: Promise.resolve({"topic-id" : "someTopic"})}))
    expect(getByText('Some Category')).toBeInTheDocument()
    expect(getByText('Some Topic')).toBeInTheDocument()
  })

  test('add new thread', async () => {
    jest.mocked(auth0.getSession).mockResolvedValue("session data" as unknown as SessionData )
    jest.mocked(getTopic).mockResolvedValue({
      topic: { id: 'someTopic'} as Topic,
      category: {} as Category,
    })
    mockRequest('post', '/api/threads', null)
    mockRequest<ReturnType>('get', '/api/threads', {
      threads: [{ id: 1, title: 'New Thread Title', author: 'some-author', text: 'First comment text' }],
    })

    const { getByRole, findByLabelText, getByLabelText, findByText } = render(await TopicPage({params: Promise.resolve({"topic-id" : "someTopic"})}))

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
