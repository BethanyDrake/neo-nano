import { flagComment } from '@/lib/serverFunctions/moderation/flagComment'
import { Flag } from '@/lib/types/forum.types'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { CommentCard } from './CommentCard'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import { vi } from 'vitest'
import { updateComment } from '../serverFunctions/forum/addThreadComment'
import { wrap } from 'souvlaki'
import { withUserContext } from '@/tests/utils/withUserContext'
import { withReactQueryClient } from '@/tests/utils/withReactQueryClient'
vi.mock('@/lib/serverFunctions/moderation/flagComment')
vi.mock('@/lib/hooks/useIsLoggedIn')
vi.mock('@/lib/serverFunctions/forum/addThreadComment')

describe('<CommentCard />', () => {
  test('no flags', async () => {
    const { findByText } = render(
      <CommentCard
        comment={{ id: '1', text: 'Plain text', richText: '<p>some rich text</p>', createdAt: new Date() }}
        author={{ id: '2', displayName: 'Some Name' }}
        flags={[]}
      />,
    )
    expect(await findByText(/Some Name/))
    expect(await findByText(/some rich text/))
  })

  test('flagged comment, no reviews', async () => {
    const flag: Flag = {
      id: '1',
      reason: 'harrassment',
      reportedBy: '',
      createdAt: new Date(),
      details: '',
      comment: '',
    }
    const { findByText, queryByText } = render(
      <CommentCard
        comment={{ id: '1', text: 'Some text.', richText: '<p>some comment text</p>', createdAt: new Date() }}
        author={{ id: '2', displayName: 'Some Name' }}
        flags={[flag]}
      />,
    )
    expect(
      await findByText(
        /This comment has been flagged as potentially inappropriate, and has been hidden while pending manual review./,
      ),
    )
    expect(queryByText(/Some text/)).not.toBeInTheDocument()
  })

  test('flagged comment, overruled by moderator', async () => {
    const flag: Flag = {
      id: '1',
      reason: 'harrassment',
      reportedBy: '',
      createdAt: new Date(),
      details: '',
      comment: '',
      reviewOutcome: 'overruled',
    }
    const { findByText } = render(
      <CommentCard
        comment={{ id: '1', text: 'Some text.', richText: '<p>some comment text</p>', createdAt: new Date() }}
        author={{ id: '2', displayName: 'Some Name' }}
        flags={[flag]}
      />,
    )
    expect(await findByText(/some comment text/))
  })

  test('flagged comment, confirmed by moderator', async () => {
    const flag: Flag = {
      id: '1',
      reason: 'harrassment',
      reportedBy: '',
      createdAt: new Date(),
      details: '',
      comment: '',
      reviewOutcome: 'confirmed',
    }
    const { findByText, queryByText } = render(
      <CommentCard
        comment={{ id: '1', text: 'Some text.', richText: '<p>some comment text</p>', createdAt: new Date() }}
        author={{ id: '2', displayName: 'Some Name' }}
        flags={[flag]}
      />,
    )
    expect(await findByText(/This comment has been removed./))

    expect(queryByText(/Some text/)).not.toBeInTheDocument()
  })

  test('flag a comment as inappropriate', async () => {
   vi.mocked(useIsLoggedIn).mockReturnValue(true)
    const { getByRole } = render(
      <CommentCard
        comment={{ id: 'comment-id', text: '', richText: '', createdAt: new Date() }}
        author={{ id: '2', displayName: 'Alice' }}
        flags={[]}
      />,
    )
    fireEvent.click(getByRole('button', { name: 'more actions' }))
    fireEvent.click(getByRole('menuitem', { name: 'report' }))
    expect(getByRole('heading', { name: "Report Alice's comment as inappropriate:" }))
    fireEvent.click(getByRole('radio', { name: 'harrassment' }))
    fireEvent.input(getByRole('textbox', { name: 'More details:' }), { target: { value: 'Some details.' } })
    fireEvent.click(getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(flagComment).toHaveBeenCalledWith({
        comment: 'comment-id',
        details: 'Some details.',
        reason: 'harrassment',
      })
    })
  })

  test('edit comment', async () => {
   vi.mocked(useIsLoggedIn).mockReturnValue(true)

    const { getByRole } = render(
      <CommentCard
        comment={{ id: 'comment-id', text: 'initial text', richText: '<p>initial rich text</p>', createdAt: new Date() }}
        author={{ id: 'my-id', displayName: 'Alice' }}
        flags={[]}
      />, {wrapper: wrap(withReactQueryClient(), withUserContext({id: 'my-id', role: 'user'}))}
    )
    fireEvent.click(getByRole('button', { name: 'more actions' }))
    fireEvent.click(getByRole('menuitem', { name: 'edit' }))
    fireEvent.change(getByRole('textbox'), {target: {value: 'new text'}})
    fireEvent.click(getByRole('button', { name: 'Edit' }))
    await waitFor(() => {
      expect(updateComment).toHaveBeenCalledWith('comment-id', "new text", "<p>new text</p>")
    })
  })
})
