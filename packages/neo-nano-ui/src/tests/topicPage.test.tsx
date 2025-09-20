import TopicPage from '@/app/forum/[topic-id]/page'
import { createThread } from '@/lib/serverFunctions/forum/createThread'
import { getThreads } from "@/lib/serverFunctions/forum/getThreads"
import { getTopic } from "@/lib/serverFunctions/forum/getTopic"
import { auth0 } from "@/lib/auth0"
import { Category, Topic } from '@/lib/forum.types'
import { SessionData } from '@auth0/nextjs-auth0/types'
import { fireEvent, render } from '@testing-library/react'
import axios from 'axios'

jest.spyOn(axios, 'post')
jest.mock('@/lib/useRequireLogin')
jest.mock('@/lib/serverFunctions/forum/getThreads')
jest.mock('@/lib/serverFunctions/forum/getTopic')
jest.mock('@/lib/serverFunctions/forum/createThread')

describe('<TopicPage />', () => {
  beforeEach(() => {
    jest.mocked(getTopic).mockResolvedValue({
      topic: { } as Topic,
      category: {} as Category,
    })
    jest.mocked(getThreads).mockResolvedValue([])
})
  it('displays existing threads', async () => {
    jest.mocked(getThreads).mockResolvedValue([{ id: '1', title: 'Existing Topic 1', author: 'some-author', text: 'First comment text' }])

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
     jest.mocked(createThread).mockResolvedValue([])

    const { getByRole, findByLabelText, getByLabelText, findByText } = render(await TopicPage({params: Promise.resolve({"topic-id" : "someTopic"})}))

    const button = getByRole('button', { name: 'Create Thread' })

    expect(button).toBeInTheDocument()
    fireEvent.click(button)

    fireEvent.change(await findByLabelText(/Title/), { target: { value: 'New Thread Title' } })
    fireEvent.change(getByLabelText(/Comment/), { target: { value: 'Some comment' } })

    jest.mocked(getThreads).mockResolvedValue([{ id: '1', title: 'New Thread Title', author: 'some-author', text: 'First comment text' }])
    fireEvent.click(getByRole('button', { name: 'Post!' }))

    expect(await findByText('New Thread Title')).toBeInTheDocument()

    expect(createThread).toHaveBeenCalledWith({
      title: 'New Thread Title',
      commentText: 'Some comment',
      topic: 'someTopic',
    })
  })
})
