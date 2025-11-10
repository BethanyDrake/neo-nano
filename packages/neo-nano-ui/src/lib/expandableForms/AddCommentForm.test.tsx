import { fireEvent, render, waitFor } from '@testing-library/react'
import { ExpandableAddCommentForm, ReplyToCommentForm } from './AddCommentForm'
import { ThreadContextProvider } from '../context/ThreadContext'
import { addThreadComment } from '@/lib/serverFunctions/forum/addThreadComment'
import { getThreadWithComments } from '../serverFunctions/forum/getThreadWithComments'

jest.mock('@/lib/serverFunctions/forum/addThreadComment')
jest.mock('@/lib/serverFunctions/forum/getThreadWithComments')

describe('<AddCommentForm />', () => {
  test('add a comment', async () => {
    // @ts-expect-error testf file
    jest.mocked(getThreadWithComments).mockResolvedValue({ totalComments: 0, commentCardDataEntries: [] })
    const { getByRole, queryByRole, findByTestId } = render(
      <ThreadContextProvider initialTotalComments={0} initialComments={[]} threadId={'thread-id'}>
        <ExpandableAddCommentForm />
      </ThreadContextProvider>,
    )
    fireEvent.click(getByRole('button', { name: 'Add Comment' }))
    fireEvent.input(await findByTestId('mock-rich-text-editor'), { target: { value: 'Some comment.' } })
    fireEvent.click(getByRole('button', { name: 'Post!' }))

    await waitFor(() => {
      expect(addThreadComment).toHaveBeenCalledWith('thread-id', 'Some comment.', '<p>Some comment.</p>')
    })

    await waitFor(() => {
      expect(getThreadWithComments).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(queryByRole('button', { name: 'Post!' })).not.toBeInTheDocument()
    })
  })

  test('cant add an empty comment', async () => {
    // @ts-expect-error testf file
    jest.mocked(getThreadWithComments).mockResolvedValue({ totalComments: 0, commentCardDataEntries: [] })
    const { getByRole, findByText } = render(
      <ThreadContextProvider initialTotalComments={0} initialComments={[]} threadId={'thread-id'}>
        <ExpandableAddCommentForm />
      </ThreadContextProvider>,
    )
    fireEvent.click(getByRole('button', { name: 'Add Comment' }))
    fireEvent.click(getByRole('button', { name: 'Post!' }))

    expect(await findByText("Can't post an empty comment.")).toBeInTheDocument()
    expect(addThreadComment).not.toHaveBeenCalled()
  })

   test('reply to an existing comment', async () => {
    // @ts-expect-error testf file
    jest.mocked(getThreadWithComments).mockResolvedValue({ totalComments: 0, commentCardDataEntries: [] })
    const { getByRole } = render(
      <ThreadContextProvider initialTotalComments={0} initialComments={[]} threadId={'thread-id'}>
        <ReplyToCommentForm comment={{id: 'comment-id', text: 'Some comment text'}} author={{id:'user-id', displayName:'Display Name'}} />
      </ThreadContextProvider>,
    )
    fireEvent.click(getByRole('button', { name: 'Reply' }))
    fireEvent.click(getByRole('button', { name: 'Post!' }))

    await waitFor(() => {
      expect(addThreadComment).toHaveBeenCalledWith('thread-id', 'Replying to Display Name:\nSome comment text\n↩️', '<p><em>Replying to Display Name:</em></p><blockquote>Some comment text</blockquote><p>↩️</p>')
    })
  })
})
