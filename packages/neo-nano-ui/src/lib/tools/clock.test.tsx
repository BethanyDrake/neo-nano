import { fireEvent, render } from "@testing-library/react"
import { Clock } from "./clock"
import { useActiveTimeBasedGoal, useUpdateActiveTimeBasedGoal } from "./useActiveTimeBasedGoal"
import { buildGoal } from "../types/forum.builders"
import { useStopwatch } from "react-timer-hook"
import { minutesToSeconds } from "date-fns"
jest.mock('./useActiveTimeBasedGoal')
jest.mock("react-timer-hook")


describe('clock', () => {
  test('add to todays total', () => {
    jest.mocked(useUpdateActiveTimeBasedGoal, ).mockReturnValue({addMinutes: jest.fn()})
    jest.mocked(useActiveTimeBasedGoal).mockReturnValue({isLoading: false, error: null, goal: buildGoal({title: 'Some Active Goal'})})
    
    // @ts-expect-error test
    jest.mocked(useStopwatch).mockReturnValue({
      minutes: 8,
      seconds: 0,
      totalSeconds: minutesToSeconds(8),
    })
    const {getByText, getByRole} = render(<Clock/>)
    expect(getByText('Update Some Active Goal')).toBeInTheDocument()
    expect(getByText('8m 0s')).toBeInTheDocument()

    fireEvent.click(getByRole('button', {name: '+8 minutes'}))
    expect(getByText('Added 8 minutes')).toBeInTheDocument()
    expect(getByRole('button', {name: '+0 minutes'})).toBeDisabled()

  })
})