import { Goal } from "@/lib/forum.types";
import { updateGoalProgress } from "@/lib/serverFunctions/goals/updateGoalProgress";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";

const ActiveGoalContext = createContext<{activeGoal: Goal | null, updateActiveGoal: (newRecords: Goal['records']) => Promise<void>}>({activeGoal: null, updateActiveGoal: () => Promise.resolve()})

export const ActiveGoalProvider = ({initialActiveGoal, children}: {initialActiveGoal: Goal | null} & PropsWithChildren) => {
    const [activeGoal, setActiveGoal] = useState(initialActiveGoal)
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