import { fireEvent, render, waitFor } from "@testing-library/react"
import { UpdateWordCount } from "./UpdateWordCount"
import { getDateAsString } from "../misc"
import { startOfToday } from "date-fns"
import { updateGoalProgress } from '../serverFunctions/goals/updateGoalProgress'
import { buildGoal } from "../types/forum.builders"
import { vi } from "vitest"
vi.mock('@/lib/serverFunctions/goals/updateGoalProgress')



describe("<UpdateWordCount />", () => {
    test('update goal progress', async () => {
        vi.mocked(updateGoalProgress).mockResolvedValue({updatedGoal: buildGoal(), claimedAwards: []})
        const {debug, getByRole} = render(<UpdateWordCount setRecords={vi.fn()} isCumulative={false} id={"goal-id"} records={[null]} startDate={getDateAsString(startOfToday())} lengthDays={1} />)
        const input = getByRole('spinbutton', {name: /wordcount for/})
        fireEvent.change(input, {target: {value: 100}})
        fireEvent.blur(input)
        await waitFor(() => {
            expect(updateGoalProgress).toHaveBeenCalledWith({id: "goal-id", records:[100]})
        })
        
        debug()
    })
})