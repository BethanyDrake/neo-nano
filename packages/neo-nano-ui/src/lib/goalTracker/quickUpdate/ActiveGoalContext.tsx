import { NewAwardModalContext } from "@/lib/awards/NewAwardModal";
import { Goal } from "@/lib/types/forum.types";
import { getDateAsString } from "@/lib/misc";
import { getActiveGoal } from "@/lib/serverFunctions/goals/getActiveGoal";
import { updateGoalProgress } from "@/lib/serverFunctions/goals/updateGoalProgress";
import { startOfToday } from "date-fns";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ActiveGoalContext = createContext<{
  activeGoal?: Goal | null
  updateActiveGoal: (newRecords: Goal['records']) => Promise<void>
  isRefreshing: boolean
  refresh: () => Promise<void>
}>({
  activeGoal: null,
  updateActiveGoal: () => Promise.resolve(),
  isRefreshing: false,
  refresh: () => Promise.resolve(),
})

const getQueryKey = () => {
  const today = getDateAsString(startOfToday())
  const queryKey = ['active-goal', today]
  return queryKey
}

export const ActiveGoalProvider = ({children}: PropsWithChildren) => {
    const {data: activeGoal, isLoading: isRefreshing} = useQuery({queryKey: getQueryKey(), queryFn: () => {
      const today = getDateAsString(startOfToday())
      return getActiveGoal(today)
    }})
    const queryClient = useQueryClient()
    const {displayNewAward} = useContext(NewAwardModalContext)

   const refresh = useCallback(async () => {
    queryClient.invalidateQueries({queryKey: ['active-goal']})
   
  }, [queryClient])
   
    const updateActiveGoal = useCallback(async (newRecords: Goal['records']) => {
        if (!activeGoal) throw Error("No active goal to update.")
        const {claimedAwards } = await updateGoalProgress({id: activeGoal?.id, records: newRecords})
        if (claimedAwards.length> 0) {
            displayNewAward(claimedAwards[0])
        }
        queryClient.invalidateQueries({queryKey: ['active-goal']})
    }, [activeGoal, displayNewAward, queryClient])

  const value = useMemo(() => {
    return { activeGoal, updateActiveGoal, isRefreshing, refresh }
  }, [activeGoal, isRefreshing, refresh, updateActiveGoal])

  return <ActiveGoalContext.Provider value={value}>{children}</ActiveGoalContext.Provider>
}

export const useActiveGoal = () => useContext(ActiveGoalContext)
