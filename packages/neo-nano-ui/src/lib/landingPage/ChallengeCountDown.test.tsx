import { render } from '@testing-library/react'
import { ChallengeCountDown } from './ChallengeCountDown'
import { getCurrentChallenge, getPreviousChallenge, getUpcomingChallenge } from '../challenges'
import { hoursToMinutes } from 'date-fns'
import { buildGoal } from '../types/forum.builders'
import { buildChallenge } from '../types/challenge.builders'
import { vi } from 'vitest'
vi.mock('../challenges')

describe('<ChallengeCountDown />', () => {
  it('does not explode', () => {
    render(<ChallengeCountDown />)
  })

  it('displays info for the of the active challenge', () => {
    vi.mocked(getCurrentChallenge).mockReturnValue(
      buildChallenge({
        title: 'Current Challenge',
        startDate: '2026-01-01',
        lengthDays: 20,
        target: 100,
        metric: 'words',
      }),
    )

    const { getByText } = render(<ChallengeCountDown />)
    // expect(getByText('Current Challenge'))
    expect(getByText(/remaining/))
  })

  it('displays info for the of the upcoming challenge', () => {
    vi.mocked(getCurrentChallenge).mockReturnValue(undefined)
    vi.mocked(getUpcomingChallenge).mockReturnValue(
      buildChallenge({
        title: 'The 80h Edit',
        startDate: '2026-01-01',
        lengthDays: 60,
        target: hoursToMinutes(80),
        metric: 'minutes',
      }),
    )

    const { getByText } = render(<ChallengeCountDown />)
    expect(getByText('The 80h Edit'))
    expect(getByText(/until the challenge begins./))
  })

  it('displays wrapup of previous challenge', () => {
    vi.mocked(getPreviousChallenge).mockReturnValue(buildGoal({ title: 'Previous Challenge' }))
    const { getByText } = render(<ChallengeCountDown />)
    expect(
      getByText(
        'Previous Challenge is over, the challenge is complete! Time to bask in your success and take a breather.',
      ),
    )
  })
})
