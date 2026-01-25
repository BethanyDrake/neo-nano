import { fireEvent, waitFor } from '@testing-library/dom'
import { SuggestNextGoal } from './SuggestNextGoal'
import { joinChallenge } from '../serverFunctions/goals/joinCurrentChallenge'
import { getCurrentChallenge, getUpcomingChallenge } from '../challenges'
import { buildChallenge } from '../types/challenge.builders'
import { render } from '@testing-library/react'
import { useModalContext } from '@/lib/modals/ModalContext'
import { mockAuthState } from '@/tests/utils/mockUseUser'

jest.mock('@/lib/challenges')
jest.mock('@/lib/serverFunctions/goals/joinCurrentChallenge')
jest.mock('@/lib/modals/ModalContext')
describe('SuggestNextGoal', () => {

  beforeEach(() => {
    mockAuthState('loggedIn')
    jest.mocked(useModalContext).mockReturnValue({
      setOpenModal: jest.fn(),
      openModal: null,
      closeModal: jest.fn()
    })
    
  })
  test('if there is no current or upcoming challenge, just make a custom goal', () => {
    const mockOpenModal = jest.fn()

    //@ts-expect-error test file
    jest.mocked(useModalContext).mockReturnValue({ setOpenModal: mockOpenModal })
    jest.mocked(getCurrentChallenge).mockReturnValue(undefined)

    jest.mocked(getUpcomingChallenge).mockReturnValue(undefined)

    const { getAllByRole, getByRole } = render(<SuggestNextGoal />)
    const buttons = getAllByRole('button')

    expect(buttons).toHaveLength(1)
    const makeCustomGoal = getByRole('button', { name: 'Add a custom goal' })
    fireEvent.click(makeCustomGoal)

    expect(mockOpenModal).toHaveBeenCalled()
  })

  test('if there is no current challenge, join an upcoming challenge', async () => {
    jest.mocked(getCurrentChallenge).mockReturnValue(undefined)
    jest
      .mocked(getUpcomingChallenge)
      .mockReturnValue(buildChallenge({ title: 'Some Upcoming Challenge', id: 'upcoming-challenge-id' }))
    jest.mocked(joinChallenge).mockResolvedValue([])
    const { getByRole } = render(<SuggestNextGoal />)

    const joinChallengeButton = getByRole('button', { name: 'Join Some Upcoming Challenge' })

    fireEvent.click(joinChallengeButton)
    await waitFor(() => {
      expect(joinChallenge).toHaveBeenCalledWith('upcoming-challenge-id')
    })
  })
  test('join current challenge', async () => {
    jest
      .mocked(getCurrentChallenge)
      .mockReturnValue(buildChallenge({ title: 'Current Challenge', id: 'current-challenge-id' }))
    jest.mocked(joinChallenge).mockResolvedValue([])
    const { getByRole } = render(<SuggestNextGoal />)

    const joinChallengeButton = getByRole('button', { name: 'Join Current Challenge' })

    fireEvent.click(joinChallengeButton)
    await waitFor(() => {
      expect(joinChallenge).toHaveBeenCalledWith('current-challenge-id')
    })
  })
})
