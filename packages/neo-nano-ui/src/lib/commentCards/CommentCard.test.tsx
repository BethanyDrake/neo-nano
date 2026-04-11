import { flagComment } from '@/lib/serverFunctions/moderation/flagComment'
import { Flag } from '@/lib/types/forum.types'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { CommentCard } from './CommentCard'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import { vi } from 'vitest'
import { deleteComment, updateComment } from '../serverFunctions/forum/addThreadComment'
import { wrap } from 'souvlaki'
import { withUserContext } from '@/tests/utils/withUserContext'
import { withReactQueryClient } from '@/tests/utils/withReactQueryClient'
import { buildComment, buildCommentSnapshot } from '../types/forum.builders'
vi.mock('@/lib/serverFunctions/moderation/flagComment')
vi.mock('@/lib/hooks/useIsLoggedIn')
vi.mock('@/lib/serverFunctions/forum/addThreadComment')

describe('<CommentCard />', () => {
  test('no flags', async () => {
    const { findByText } = render(
      <CommentCard
        comment={buildComment({ id: '1', richText: '<p>some rich text</p>' })}
        author={{ id: '2', displayName: 'Some Name' }}
        flags={[]}
        snapshots={[]}
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
        comment={buildComment({ id: '1', richText: 'Some text' })}
        author={{ id: '2', displayName: 'Some Name' }}
        flags={[flag]}
        snapshots={[]}
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
        comment={buildComment({ id: '1', richText: '<p>some comment text</p>' })}
        author={{ id: '2', displayName: 'Some Name' }}
        flags={[flag]}
        snapshots={[]}
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
        comment={buildComment({ id: '1', richText: '<p>Some text/p>' })}
        author={{ id: '2', displayName: 'Some Name' }}
        flags={[flag]}
        snapshots={[]}
      />,
    )
    expect(await findByText(/This comment has been removed./))

    expect(queryByText(/Some text/)).not.toBeInTheDocument()
  })

  test('flag a comment as inappropriate', async () => {
    vi.mocked(useIsLoggedIn).mockReturnValue(true)
    const { getByRole } = render(
      <CommentCard
        comment={buildComment({ id: 'comment-id' })}
        author={{ id: '2', displayName: 'Alice' }}
        flags={[]}
        snapshots={[]}
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
    const { getByRole } = render(
      <CommentCard
        comment={buildComment({ id: 'comment-id', text: 'initial text', richText: '<p>initial rich text</p>' })}
        author={{ id: 'my-id', displayName: 'Alice' }}
        flags={[]}
        snapshots={[]}
      />,
      { wrapper: wrap(withReactQueryClient(), withUserContext({ id: 'my-id', role: 'user' })) },
    )
    fireEvent.click(getByRole('button', { name: 'more actions' }))
    fireEvent.click(getByRole('menuitem', { name: 'edit' }))
    fireEvent.change(getByRole('textbox'), { target: { value: 'new text' } })
    fireEvent.click(getByRole('button', { name: 'Edit' }))
    await waitFor(() => {
      expect(updateComment).toHaveBeenCalledWith('comment-id', 'new text', '<p>new text</p>')
    })
  })

    test('delete comment', async () => {
    vi.mocked(deleteComment).mockResolvedValue(buildComment())

    const { getByRole } = render(
      <CommentCard
        comment={buildComment({ id: 'comment-id'})}
        author={{ id: 'my-id', displayName: 'Alice' }}
        flags={[]}
        snapshots={[]}
      />,
      { wrapper: wrap(withReactQueryClient(), withUserContext({ id: 'my-id', role: 'user' })) },
    )
    fireEvent.click(getByRole('button', { name: 'more actions' }))
    fireEvent.click(getByRole('menuitem', { name: 'delete' }))
    fireEvent.click(getByRole('button', { name: 'Yes, delete my comment' }))
    await waitFor(() => {
      expect(deleteComment).toHaveBeenCalledWith('comment-id')
    })
  })

  describe('snapshots', () => {
    test('comment with no edits', () => {
      const { getAllByRole } = render(
        <CommentCard
          comment={buildComment({ id: 'comment-id' })}
          author={{ id: '2', displayName: 'Alice' }}
          flags={[]}
          snapshots={[]}
        />,
      )

      expect(getAllByRole('time')).toHaveLength(1)
    })

    test('comment with multiple edits', () => {
      const { getAllByRole, getByRole } = render(
        <CommentCard
          comment={buildComment({ id: 'comment-id' })}
          author={{ id: '2', displayName: 'Alice' }}
          flags={[]}
          snapshots={[buildCommentSnapshot({ version: 0 }), buildCommentSnapshot({ version: 1 })]}
        />,
      )

      expect(getAllByRole('time')).toHaveLength(2)
      expect(getByRole('button', { name: '(view original)' })).toBeInTheDocument()
      expect(getByRole('button', { name: '(view v1)' })).toBeInTheDocument()
    })

    test('deleted comment', () => {
      const { getByRole, getByText } = render(
        <CommentCard
          comment={buildComment({ id: 'comment-id', isDeleted: true })}
          author={{ id: '2', displayName: 'Alice' }}
          flags={[]}
          snapshots={[buildCommentSnapshot({ version: 0 }), buildCommentSnapshot({ version: 1 })]}
        />,
      )

      expect(getByText('This comment has been deleted by the author.')).toBeInTheDocument()
      expect(getByRole('button', { name: '(view original)' })).toBeInTheDocument()
    })
  })
})
