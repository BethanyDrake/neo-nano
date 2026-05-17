import { fireEvent, render, waitFor } from '@testing-library/react'
import { LikeButton } from './LikeButton'
import { ReactionContextProvider } from '../context/ReactionContext'
import { getThreadReactions } from '@/lib/serverFunctions/forum/getThreadReactions'
import { getMyProfile } from '../serverFunctions/profile/getMyProfile'
import { Profile } from '@/lib/types/forum.types'
import { likeComment, unlikeComment } from '../serverFunctions/forum/likeComment'
import { vi } from 'vitest'
import { withUserContext } from '@/tests/utils/withUserContext'
import { wrap } from 'souvlaki'

vi.mock('@/lib/serverFunctions/forum/getThreadReactions')
vi.mock('@/lib/serverFunctions/profile/getMyProfile')
vi.mock('@/lib/serverFunctions/forum/likeComment')

describe('<LikeButton />', () => {
  it('displays number of likes', async () => {
    vi.mocked(getThreadReactions).mockResolvedValue({ ['comment-id']: { like: ['user-1', 'user-2'] } })
    vi.mocked(getMyProfile).mockResolvedValue(null)
    const { findByText } = render(
        <ReactionContextProvider threadId={'666'}>
          <LikeButton commentId="comment-id" />
        </ReactionContextProvider>, {wrapper: wrap(withUserContext(null))},
    )
    expect(await findByText(2))
  })

  test('like a comment', async () => {
    vi.mocked(getThreadReactions).mockResolvedValue({})
    const { findByRole } = render(
        <ReactionContextProvider threadId={'thread-id'}>
          <LikeButton commentId="comment-id" />
        </ReactionContextProvider>, {wrapper: wrap(withUserContext({ id: 'my-id' } as Profile))}
    )

    const likeButton = await findByRole('button', { name: 'like' })
    await waitFor(() => {
      expect(likeButton).toBeEnabled()
    })

    fireEvent.click(likeButton)
    await waitFor(() => {
      expect(likeComment).toHaveBeenCalledWith('comment-id')
    })
  })

  test('like a comment', async () => {
    vi.mocked(getThreadReactions).mockResolvedValue({ ['comment-id']: { like: ['my-id'] } })

    const { findByRole } = render(
        <ReactionContextProvider threadId={'thread-id'}>
          <LikeButton commentId="comment-id" />
        </ReactionContextProvider>, {wrapper: wrap(withUserContext({ id: 'my-id' } as Profile))}
    )

    const likeButton = await findByRole('button', { name: 'like' })
    await waitFor(() => {
      expect(likeButton).toBeEnabled()
    })

    fireEvent.click(likeButton)
    await waitFor(() => {
      expect(unlikeComment).toHaveBeenCalledWith('comment-id')
    })
  })
})
