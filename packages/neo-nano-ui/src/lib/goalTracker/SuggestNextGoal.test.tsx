import { fireEvent, waitFor } from '@testing-library/dom'
import { SuggestNextGoal } from './SuggestNextGoal'
import { joinChallenge } from '../serverFunctions/goals/joinCurrentChallenge'
import { getCurrentChallenge, getUpcomingChallenge } from '../challenges'
import { buildChallenge } from '../types/challenge.builders'
import { render } from '@testing-library/react'
import { useModalContext } from '@/lib/modals/ModalContext'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import { vi } from 'vitest'

vi.mock('@/lib/challenges')
vi.mock('@/lib/serverFunctions/goals/joinCurrentChallenge')
vi.mock('@/lib/modals/ModalContext')
vi.mock('@/lib/hooks/useIsLoggedIn')
describe('SuggestNextGoal', () => {

  beforeEach(() => {
    vi.mocked(useIsLoggedIn).mockReturnValue(true)
    vi.mocked(useModalContext).mockReturnValue({
      setOpenModal: vi.fn(),
      openModal: null,
      closeModal: vi.fn()
    })
    
  })
  test('if there is no current or upcoming challenge, just make a custom goal', () => {
    const mockOpenModal = vi.fn()

    //@ts-expect-error test file
    vi.mocked(useModalContext).mockReturnValue({ setOpenModal: mockOpenModal })
    vi.mocked(getCurrentChallenge).mockReturnValue(undefined)

    vi.mocked(getUpcomingChallenge).mockReturnValue(undefined)

    const { getAllByRole, getByRole } = render(<SuggestNextGoal />)
    const buttons = getAllByRole('button')

    expect(buttons).toHaveLength(1)
    const makeCustomGoal = getByRole('button', { name: 'Add a custom goal' })
    fireEvent.click(makeCustomGoal)

    expect(mockOpenModal).toHaveBeenCalled()
  })

  test('if there is no current challenge, join an upcoming challenge', async () => {
    vi.mocked(getCurrentChallenge).mockReturnValue(undefined)
    vi
      .mocked(getUpcomingChallenge)
      .mockReturnValue(buildChallenge({ title: 'Some Upcoming Challenge', id: 'upcoming-challenge-id' }))
    vi.mocked(joinChallenge).mockResolvedValue([])
    const { getByRole } = render(<SuggestNextGoal />)

    const joinChallengeButton = getByRole('button', { name: 'Join Some Upcoming Challenge' })

    fireEvent.click(joinChallengeButton)
    await waitFor(() => {
      expect(joinChallenge).toHaveBeenCalledWith('upcoming-challenge-id')
    })
  })
  test('join current challenge', async () => {
    vi
      .mocked(getCurrentChallenge)
      .mockReturnValue(buildChallenge({ title: 'Current Challenge', id: 'current-challenge-id' }))
    vi.mocked(joinChallenge).mockResolvedValue([])
    const { getByRole } = render(<SuggestNextGoal />)

    const joinChallengeButton = getByRole('button', { name: 'Join Current Challenge' })

    fireEvent.click(joinChallengeButton)
    await waitFor(() => {
      expect(joinChallenge).toHaveBeenCalledWith('current-challenge-id')
    })
  })
})
