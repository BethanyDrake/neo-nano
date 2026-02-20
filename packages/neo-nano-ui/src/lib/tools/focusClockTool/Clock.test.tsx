import { fireEvent, render } from "@testing-library/react"
import { Clock } from "./Clock"
import { useActiveTimeBasedGoal, useUpdateActiveTimeBasedGoal } from "./useActiveTimeBasedGoal"
import { buildGoal } from "@/lib/types/forum.builders"
import { useStopwatch } from "react-timer-hook"
import { minutesToSeconds } from "date-fns"
import { vi } from "vitest"
vi.mock('./useActiveTimeBasedGoal')
vi.mock("react-timer-hook")


describe('clock', () => {
  test('add to todays total', () => {
    vi.mocked(useUpdateActiveTimeBasedGoal, ).mockReturnValue({addMinutes: vi.fn()})
    vi.mocked(useActiveTimeBasedGoal).mockReturnValue({isLoading: false, error: null, goal: buildGoal({title: 'Some Active Goal'})})
    
    // @ts-expect-error test
    vi.mocked(useStopwatch).mockReturnValue({
      minutes: 8,
      seconds: 0,
      totalSeconds: minutesToSeconds(8),
    })
    const {getByText, getByRole} = render(<Clock/>)
    expect(getByText('Update Some Active Goal'))
    expect(getByText('8m 0s'))

    fireEvent.click(getByRole('button', {name: '+8 minutes'}))
    expect(getByText('Added 8 minutes'))
    expect(getByRole('button', {name: '+0 minutes'})).toBeDisabled()

  })
})