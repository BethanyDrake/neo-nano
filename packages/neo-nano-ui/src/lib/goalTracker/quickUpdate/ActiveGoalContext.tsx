import { NewAwardModalContext } from "@/lib/awards/NewAwardModal";
import { Goal } from "@/lib/forum.types";
import { getDateAsString } from "@/lib/misc";
import { getActiveGoal } from "@/lib/serverFunctions/goals/getActiveGoal";
import { updateGoalProgress } from "@/lib/serverFunctions/goals/updateGoalProgress";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";

const ActiveGoalContext = createContext<{
  activeGoal: Goal | null
  updateActiveGoal: (newRecords: Goal['records']) => Promise<void>
  isRefreshing: boolean
  refresh: () => Promise<void>
}>({
  activeGoal: null,
  updateActiveGoal: () => Promise.resolve(),
  isRefreshing: false,
  refresh: () => Promise.resolve(),
})


export const ActiveGoalProvider = ({children}: PropsWithChildren) => {
    const [activeGoal, setActiveGoal] = useState<Goal | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const {displayNewAward} = useContext(NewAwardModalContext)
   const refresh = useCallback(async () => {
    setIsRefreshing(true)
    const today = getDateAsString(new Date())
    console.log({ today })
    await getActiveGoal(today).then(setActiveGoal)
    setIsRefreshing(false)
  }, [])
   
    const updateActiveGoal = useCallback(async (newRecords: Goal['records']) => {
        if (!activeGoal) throw Error("No active goal to update.")
        const {updatedGoal, claimedAwards } = await updateGoalProgress({id: activeGoal?.id, records: newRecords})
        if (claimedAwards.length> 0) {
            displayNewAward(claimedAwards[0])
        }
        setActiveGoal(updatedGoal)
    }, [activeGoal, displayNewAward])

  const value = useMemo(() => {
    return { activeGoal, updateActiveGoal, isRefreshing, refresh }
  }, [activeGoal, isRefreshing, refresh, updateActiveGoal])

  return <ActiveGoalContext.Provider value={value}>{children}</ActiveGoalContext.Provider>
}

export const useActiveGoal = () => useContext(ActiveGoalContext)
