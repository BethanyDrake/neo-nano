import { getHasActiveOrUpcomingGoal } from "../serverFunctions/goals/getActiveGoal"
import { getDateAsString } from "../misc"
import { startOfToday } from "date-fns"
import { useQuery } from "@tanstack/react-query"

export const useHasActiveOrUpcomingGoal = () => {
    const date = getDateAsString(startOfToday())
    const {data: hasActiveOrUpcomingGoal, isLoading} = useQuery({
        queryFn: () => getHasActiveOrUpcomingGoal(date),
        queryKey: ['has-active-or-upcoming-goal', date]
    })
    return {isLoading, hasActiveOrUpcomingGoal}
}