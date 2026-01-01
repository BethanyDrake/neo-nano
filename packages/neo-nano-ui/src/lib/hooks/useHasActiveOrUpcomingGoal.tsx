import { useEffect, useState } from "react"
import { getHasActiveOrUpcomingGoal } from "../serverFunctions/goals/getActiveGoal"
import { getDateAsString } from "../misc"
import { startOfToday } from "date-fns"

export const useHasActiveOrUpcomingGoal = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [hasActiveOrUpcomingGoal, setHasActiveOrUpcomingGoal] = useState<boolean>()
    useEffect(() => {
        getHasActiveOrUpcomingGoal(getDateAsString(startOfToday())).then((result) => {
            setHasActiveOrUpcomingGoal(result)
            setIsLoading(false)
        })
    
    }, [])

    return {isLoading, hasActiveOrUpcomingGoal}
}