import { flagComment } from '@/lib/serverFunctions/moderation/flagComment'
import { Flag } from '@/lib/types/forum.types'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { ModalContextProvider } from '../modals/ModalContext'
import { CommentCard } from './CommentCard'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import { vi } from 'vitest'
vi.mock('@/lib/serverFunctions/moderation/flagComment')
vi.mock('@/lib/context/UserContext')
vi.mock('@/lib/hooks/useIsLoggedIn')

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
    expect(queryByText(/Some text/)).not
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

    expect(queryByText(/Some text/)).not
  })

  test('flag a comment as inappropriate', async () => {
   vi.mocked(useIsLoggedIn).mockReturnValue(true)
    const { getByRole } = render(
      <CommentCard
        comment={{ id: 'comment-id', text: '', richText: '', createdAt: new Date() }}
        author={{ id: '2', displayName: '' }}
        flags={[]}
      />,
      { wrapper: ModalContextProvider },
    )
    fireEvent.click(getByRole('button', { name: 'Report comment as inappropriate' }))
    expect(getByRole('heading', { name: 'Report Comment as Inappropriate' }))
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
})
