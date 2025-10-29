import { Goal } from "@/lib/forum.types";
import { getDateAsString } from "@/lib/misc";
import { getActiveGoal } from "@/lib/serverFunctions/goals/getActiveGoal";
import { updateGoalProgress } from "@/lib/serverFunctions/goals/updateGoalProgress";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ActiveGoalContext = createContext<{activeGoal: Goal | null, updateActiveGoal: (newRecords: Goal['records']) => Promise<void>}>({activeGoal: null, updateActiveGoal: () => Promise.resolve()})

export const ActiveGoalProvider = ({children}: PropsWithChildren) => {
    const [activeGoal, setActiveGoal] = useState<Goal | null>(null)

    useEffect(() => {
        const today = getDateAsString(new Date())
        console.log({today})
        getActiveGoal(today).then(setActiveGoal)
    }, [])

    const updateActiveGoal = useCallback(async (newRecords: Goal['records']) => {
        if (!activeGoal) throw Error("No active goal to update.")
        const {updatedGoal} = await updateGoalProgress({id: activeGoal?.id, records: newRecords})
        setActiveGoal(updatedGoal)
    }, [activeGoal])

    const value = useMemo(() => {
        return {activeGoal, updateActiveGoal }
    }, [activeGoal, updateActiveGoal])

    return <ActiveGoalContext.Provider value={value}>{children}</ActiveGoalContext.Provider>
}


export const useActiveGoal = () => useContext(ActiveGoalContext)