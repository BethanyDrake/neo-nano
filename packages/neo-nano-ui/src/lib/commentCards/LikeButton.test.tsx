import { fireEvent, render, waitFor } from '@testing-library/react'
import { LikeButton } from './LikeButton'
import { UserContextProvider } from '../context/UserContext'
import { ReactionContextProvider } from '../context/ReactionContext'
import { getThreadReactions } from '@/lib/serverFunctions/forum/getThreadReactions'
import { getMyProfile } from '../serverFunctions/profile/getMyProfile'
import { Profile } from '@/lib/types/forum.types'
import { likeComment, unlikeComment } from '../serverFunctions/forum/likeComment'
import { vi } from 'vitest'

vi.mock('@/lib/serverFunctions/forum/getThreadReactions')
vi.mock('@/lib/serverFunctions/profile/getMyProfile')
vi.mock('@/lib/serverFunctions/forum/likeComment')

describe('<LikeButton />', () => {
  it('displays number of likes', async () => {
    vi.mocked(getThreadReactions).mockResolvedValue({ ['comment-id']: { like: ['user-1', 'user-2'] } })
    vi.mocked(getMyProfile).mockResolvedValue(null)
    const { findByText } = render(
      <UserContextProvider>
        <ReactionContextProvider threadId={'666'}>
          <LikeButton commentId="comment-id" />
        </ReactionContextProvider>
      </UserContextProvider>,
    )
    expect(await findByText(2))
  })

  test('like a comment', async () => {
    vi.mocked(getThreadReactions).mockResolvedValue({})
    vi.mocked(getMyProfile).mockResolvedValue({ id: 'my-id' } as Profile)
    const { findByRole } = render(
      <UserContextProvider>
        <ReactionContextProvider threadId={'thread-id'}>
          <LikeButton commentId="comment-id" />
        </ReactionContextProvider>
      </UserContextProvider>,
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
    vi.mocked(getMyProfile).mockResolvedValue({ id: 'my-id' } as Profile)
    const { findByRole } = render(
      <UserContextProvider>
        <ReactionContextProvider threadId={'thread-id'}>
          <LikeButton commentId="comment-id" />
        </ReactionContextProvider>
      </UserContextProvider>,
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
