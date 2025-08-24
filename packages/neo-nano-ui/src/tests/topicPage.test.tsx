import { ReturnType } from '@/app/api/threads/route'
import { Topic } from '@/lib/forum.types'
import TopicPage from '@/pages/forum/[topic-id]'
import { fireEvent, render } from '@testing-library/react'
import axios from 'axios'
import { NextPageContext } from 'next'
import { mockRequest } from './utils/mswHelpers'

jest.spyOn(axios, 'post')

describe('<TopicPage />', () => {
  it('displays existing threads', async () => {
    mockRequest<ReturnType>('get', '/undefined/api/threads', {
      threads: [{ id: 1, title: 'Existing Topic 1', author: 'some-author' }],
    })
    const context: Partial<NextPageContext> = { query: { ['topic-id']: 'someTopic' } }
    const initalProps = await TopicPage.getInitialProps(context as NextPageContext)

    const { getByText } = render(<TopicPage {...initalProps} />)
    expect(getByText('Existing Topic 1')).toBeInTheDocument()
  })

  test('add new thread', async () => {
    mockRequest('post', '/api/threads', null)
    mockRequest<ReturnType>('get', '/api/threads', {
      threads: [{ id: 1, title: 'New Thread Title', author: 'some-author' }],
    })

    const { getByRole, findByLabelText, getByLabelText, findByText } = render(
      <TopicPage topic={{ id: 'someTopic' } as Topic} initialThreads={[]} />,
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
