import TopicPage from '@/app/forum/[topic-id]/page'
import { createThread } from '@/lib/serverFunctions/forum/createThread'
import { getThreads } from "@/lib/serverFunctions/forum/getThreads"
import { getTopic } from "@/lib/serverFunctions/forum/getTopic"
import { auth0 } from "@/lib/auth0"
import { Category, Topic } from '@/lib/types/forum.types'
import { SessionData } from '@auth0/nextjs-auth0/types'
import { fireEvent, render } from '@testing-library/react'
import axios from 'axios'
import { buildThreadSummary } from '@/lib/types/forum.builders'
import { vi } from 'vitest'

vi.spyOn(axios, 'post')
vi.mock('next/navigation', () => ({
  usePathname: () => '',
  useRouter: () => ({
    push: () => {}
  })
}))
vi.mock('@/lib/useRequireLogin')
vi.mock('@/lib/serverFunctions/forum/getThreads')
vi.mock('@/lib/serverFunctions/forum/getTopic')
vi.mock('@/lib/serverFunctions/forum/createThread')

describe('<TopicPage />', () => {
  beforeEach(() => {
    vi.mocked(getTopic).mockResolvedValue({
      topic: { } as Topic,
      category: {} as Category,
    })
    vi.mocked(getThreads).mockResolvedValue({totalThreads: 0, threadSummaries:[]})
})
  it('displays existing threads', async () => {
    vi.mocked(getThreads).mockResolvedValue({totalThreads: 1, threadSummaries:[buildThreadSummary({ id: '1', title: 'Existing Topic 1', author: 'some-author', text: 'First comment text', totalComments: 7 , authorDisplayName: 'Author Name'})]})

    const { getByText } = render(await TopicPage({params: Promise.resolve({"topic-id" : "someTopic"})}))
    expect(getByText('Existing Topic 1'))
    expect(getByText('Author Name: First comment text'))
        expect(getByText('7'))
  })

  test('breadcumbs: category > topic', async () => {
    vi.mocked(getTopic).mockResolvedValue({
      topic: { id: 'topic-id', title: 'Some Topic' } as Topic,
      category: { id: 'category-id', title: 'Some Category' } as Category,
    })


    const { getByText } = render(await TopicPage({params: Promise.resolve({"topic-id" : "someTopic"})}))
    expect(getByText('Some Category'))
    expect(getByText('Some Topic'))
  })

  test('add new thread', async () => {
    vi.mocked(auth0.getSession).mockResolvedValue("session data" as unknown as SessionData )
    vi.mocked(getTopic).mockResolvedValue({
      topic: { id: 'someTopic'} as Topic,
      category: {} as Category,
    })
     vi.mocked(createThread).mockResolvedValue({totalThreads: 0, threadSummaries:[]})

    const {getByTestId, getByRole, findByLabelText, findByText } = render(await TopicPage({params: Promise.resolve({"topic-id" : "someTopic"})}))

    const button = getByRole('button', { name: 'Create Thread' })

    expect(button)
    fireEvent.click(button)

    fireEvent.change(await findByLabelText(/Title/), { target: { value: 'New Thread Title' } })
    fireEvent.change(getByTestId('mock-rich-text-editor'), { target: { value: 'Some comment' } })
    
   vi.mocked(getThreads).mockResolvedValue({
    totalThreads: 1,
    threadSummaries: [buildThreadSummary({ id: '1', title: 'New Thread Title'})]})
    fireEvent.click(getByRole('button', { name: 'Post!' }))

    expect(await findByText('New Thread Title'))

    expect(createThread).toHaveBeenCalledWith({
      title: 'New Thread Title',
      commentText: 'Some comment',
      commentRichText: '<p>Some comment</p>',
      topic: 'someTopic',
    })
  })
})
