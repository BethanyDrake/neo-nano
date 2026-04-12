import { getIsModerator } from '@/lib/serverFunctions/moderation/getIsModerator'
import { NavMenu } from './NavMenu'
import { fireEvent, render } from '@testing-library/react'
import { vi } from 'vitest'
import { wrap } from 'souvlaki'
import { withReactQueryClient } from '@/tests/utils/withReactQueryClient'
vi.mock('@/lib/serverFunctions/moderation/getIsModerator')

describe('<NavMenu />', () => {
  test('regular user', async () => {
    vi.mocked(getIsModerator).mockResolvedValue(false)
    const { findByRole, getByRole } = render(<NavMenu />, { wrapper: wrap(withReactQueryClient()) })
    expect(getByRole('button'))
    fireEvent.click(getByRole('button'))
    await findByRole('menuitem', { name: 'Home' })
  })
  test('moderator', async () => {
    vi.mocked(getIsModerator).mockResolvedValue(true)
    const { findByRole, getByRole } = render(<NavMenu />, { wrapper: wrap(withReactQueryClient()) })
    expect(getByRole('button'))
    fireEvent.click(getByRole('button'))

    await findByRole('menuitem', { name: 'Moderation' })
  })
})
