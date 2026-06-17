'use client'
import { useNewAwardModalContext } from '@/lib/awards/NewAwardModal'
import { getDateAsString } from '@/lib/misc'
import { getActiveGoal } from '@/lib/serverFunctions/goals/getActiveGoal'
import { dateToChallengeDay } from '@/lib/serverFunctions/goals/goalUtils'
import { UpdatedGoalProgressReturn, updateGoalProgress } from '@/lib/serverFunctions/goals/updateGoalProgress'
import { Goal, Record } from '@/lib/types/forum.types'
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { startOfToday } from 'date-fns'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { changeAtIndex } from '../recordUtils'
import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn'

const ActiveGoalContext = createContext<{
  activeGoal?: Goal | null
  updateActiveGoal: UseMutateFunction<UpdatedGoalProgressReturn, Error, Record[], unknown>,
  addToTodaysTotal:  UseMutateFunction<UpdatedGoalProgressReturn, Error, number, unknown>,
  isRefreshing: boolean
  refresh: () => void
  isUpdating: boolean
}>({
  activeGoal: null,
  updateActiveGoal: () => {},
  addToTodaysTotal: () => {},
  isRefreshing: false,
  refresh: () => {},
  isUpdating: false
})

const getQueryKey = () => {
  const today = getDateAsString(startOfToday())
  const queryKey = ['active-goal', today]
  return queryKey
}

export const ActiveGoalProviderInner = ({ children }: PropsWithChildren) => {
  const { data: activeGoal, isLoading: isRefreshing, refetch } = useQuery({
    queryKey: getQueryKey(),
    queryFn: () => {
      const today = getDateAsString(startOfToday())
      return getActiveGoal(today)

    },
  }, )

  const queryClient = useQueryClient()
  const { displayNewAward } = useNewAwardModalContext()


  const { mutate: updateActiveGoal, status: updateActiveGoalStatus } = useMutation({
    mutationFn: async (newRecords: Goal['records']) => {
      if (!activeGoal) throw Error('No active goal to update.')
      return updateGoalProgress({ id: activeGoal?.id, records: newRecords })
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData(getQueryKey(), data.updatedGoal)
      if (data.claimedAwards.length > 0) {
        displayNewAward(data.claimedAwards[0])
      }
      context.client.resetQueries({queryKey: ['my-goals']})
      context.client.invalidateQueries({queryKey: ['active-goal']})
    },
  })

  const { mutate: addToTodaysTotal, status: addToTodaysTotalStatus } = useMutation({
    mutationFn: async (toAdd: number) => {
      if (!activeGoal) throw Error('No active goal to update.')
      const oldRecords = activeGoal?.records
      const challengeDay = dateToChallengeDay(activeGoal.startDate, startOfToday())
      const oldValue = oldRecords[challengeDay] ?? 0
      const newRecords = changeAtIndex(oldRecords, challengeDay, oldValue + toAdd)
      return updateGoalProgress({ id: activeGoal?.id, records: newRecords })
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData(getQueryKey(), data.updatedGoal)
      if (data.claimedAwards.length > 0) {
        displayNewAward(data.claimedAwards[0])
      }
      context.client.invalidateQueries({queryKey: ['my-goals']})
      context.client.invalidateQueries({queryKey: ['active-goal']})
    },
  })

  const value = useMemo(() => {
    return { activeGoal, updateActiveGoal, isRefreshing, refresh: refetch, addToTodaysTotal, 
      isUpdating:  addToTodaysTotalStatus === 'pending' || updateActiveGoalStatus === 'pending' }
  }, [activeGoal, updateActiveGoal, isRefreshing, refetch, addToTodaysTotal, addToTodaysTotalStatus, updateActiveGoalStatus])

  return <ActiveGoalContext.Provider value={value}>{children}</ActiveGoalContext.Provider>
}

export const ActiveGoalProvider = ({children}:PropsWithChildren) => {
  const isLoggedIn = useIsLoggedIn()
  if (!isLoggedIn) return <>{children}</>
  return <ActiveGoalProviderInner>{children}</ActiveGoalProviderInner>
}

export const useActiveGoal = () => useContext(ActiveGoalContext)
