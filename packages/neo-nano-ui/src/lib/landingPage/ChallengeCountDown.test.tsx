import { render } from "@testing-library/react"
import { ChallengeCountDown } from "./ChallengeCountDown"
import { getCurrentChallenge, getPreviousChallenge, getUpcomingChallenge } from "../challenges"
import { hoursToMinutes } from "date-fns"
import { buildGoal } from "../types/forum.builders"

jest.mock('../challenges')

describe('<ChallengeCountDown />', () => {
  it('does not explode', () => {
    render(<ChallengeCountDown/>)
  })

    it.only('displays info for the of the active challenge', () => {
    jest.mocked(getCurrentChallenge).mockReturnValue({
        title: 'Current Challenge',
        startDate: '2026-01-01',
        lengthDays: 20,
        target: 100,
        metric: 'words'
      })

    const {getByText} =  render(<ChallengeCountDown/>)
    // TODO
    // expect(getByText('Current Challenge')).toBeInTheDocument()
    expect(getByText(/remaining/)).toBeInTheDocument()
  })

  it('displays info for the of the upcoming challenge', () => {
    jest.mocked(getUpcomingChallenge).mockReturnValue({
        title: 'The 80h Edit',
        startDate: '2026-01-01',
        lengthDays: 60,
        target: hoursToMinutes(80),
        metric: 'minutes'
      })

    const {getByText} =  render(<ChallengeCountDown/>)
    expect(getByText('The 80h Edit')).toBeInTheDocument()
    expect(getByText(/until the challenge begins./)).toBeInTheDocument()
  })

  it('displays wrapup of previous challenge', () => {
    jest.mocked(getPreviousChallenge).mockReturnValue(buildGoal({title: 'Previous Challenge'}))
    const {getByText} =  render(<ChallengeCountDown/>)
    expect(getByText('Previous Challenge is over, the challenge is complete! Time to bask in your success and take a breather.')).toBeInTheDocument()
  })
})