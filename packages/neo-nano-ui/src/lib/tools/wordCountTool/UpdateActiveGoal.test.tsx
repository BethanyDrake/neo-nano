import { vi } from "vitest"
import { useUpdateActiveGoal } from "../focusClockTool/useActiveGoal"
import { buildGoal } from "@/lib/types/forum.builders"
import { fireEvent, render } from "@testing-library/react"
import { UpdateActiveGoal } from "./UpdateActiveGoal"
import { getTodaysProgress } from "@/lib/goalTracker/recordUtils"
vi.mock('../focusClockTool/useActiveGoal')
vi.mock('@/lib/goalTracker/recordUtils')
describe('UpdateActiveGoal', () => {
  test("add to today's total", () => {
    const addValue = vi.fn()
    vi.mocked(getTodaysProgress).mockReturnValue(200)
    vi.mocked(useUpdateActiveGoal).mockReturnValue({ addValue})
    const goal = buildGoal({ title: 'Some Active Goal' })

    const { getByRole, getByText } = render(<UpdateActiveGoal goal={goal} wordCount={4} hasUpdatedActiveGoal={false} setHasUpdatedActiveGoal={vi.fn() } />)


    expect(getByText('Update Some Active Goal')).toBeInTheDocument()
    expect(getByText('(so far today: 200 words)')).toBeInTheDocument()
    fireEvent.click(getByRole('button', {name: '+4 words'}))
    expect(addValue).toHaveBeenCalledWith(4)
  })

   test("update today's total", () => {
    const addValue = vi.fn()
    vi.mocked(getTodaysProgress).mockReturnValue(200)
    vi.mocked(useUpdateActiveGoal).mockReturnValue({ addValue})
    const goal = buildGoal({ title: 'Some Active Goal' })

    const { getByRole, getByText } = render(<UpdateActiveGoal goal={goal} wordCount={267} hasUpdatedActiveGoal={false} setHasUpdatedActiveGoal={vi.fn() } />)


    expect(getByText('Update Some Active Goal')).toBeInTheDocument()
    expect(getByText('(so far today: 200 words)')).toBeInTheDocument()
    fireEvent.click(getByRole('button', {name: "Update today's total (+67 words)"}))
    expect(addValue).toHaveBeenCalledWith(67)
  })
})