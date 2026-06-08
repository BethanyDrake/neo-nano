import { fireEvent, render, waitFor } from "@testing-library/react"
import { PastSprintCard } from "./SprintCard"
import { minutesToSeconds } from "date-fns"
import { wrap } from "souvlaki"
import { withReactQueryClient } from "@/tests/utils/withReactQueryClient"
import { getPublicSprintLog } from "@/lib/serverFunctions/sprints/publicSprint"
vi.mock('@/lib/serverFunctions/sprints/publicSprint')
describe("SprintCards", () => {
    test("PastSprintCard", async () => {
        vi.mocked(getPublicSprintLog).mockResolvedValue([{
            participationState: "completed",
            wordCount: 300,
            userId: "user-1",
            displayName: "Alice"
        }])
        const {getByText, container} = render(<PastSprintCard id={'sprint-1'} startTime={new Date()} durationSeconds={minutesToSeconds(5)}  />, {wrapper: wrap(withReactQueryClient())})
        expect(getByText("5m")).toBeInTheDocument()
        fireEvent.click(getByText("5m"))
        await waitFor(() => {
            expect(container).toHaveTextContent("Alice: 300 words")
        })

    })
})