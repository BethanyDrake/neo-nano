'use client'
import { startOfToday } from 'date-fns'
import { getDateAsString } from '../misc'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import { getActiveTimeBasedGoal } from '../serverFunctions/goals/getActiveGoal'
import { useMutation, useQuery } from '@tanstack/react-query'
import { dateToChallengeDay } from '../serverFunctions/goals/goalUtils'
import { Goal } from '../types/forum.types'
import { changeAtIndex } from '../goalTracker/recordUtils'
import { updateGoalProgress } from '../serverFunctions/goals/updateGoalProgress'
import { useContext } from 'react'
import { NewAwardModalContext } from '../awards/NewAwardModal'

const getQueryKey = () => {
  const today = getDateAsString(startOfToday())
  const queryKey = ['active-goal', 'time-based', today]
  return queryKey
}

export const useActiveTimeBasedGoal = () => {
  const isLoggedIn = useIsLoggedIn()
  const today = getDateAsString(startOfToday())
  const queryKey = ['active-goal', 'time-based', today]

  const { isLoading, data, error } = useQuery({
    queryKey,
    queryFn: () => getActiveTimeBasedGoal(today),
    enabled: isLoggedIn,
  })
  return {
    isLoading,
    goal: data,
    error,
  }
}

const getOptimisticGoal = (minutesToAdd: number, old: Goal): Goal => {
  const today = getDateAsString(startOfToday())
  const challengeDay = dateToChallengeDay(old.startDate, today)
  const previousTotal = old.records[challengeDay] ?? 0
  const updatedRecords = changeAtIndex(old.records, challengeDay, previousTotal + minutesToAdd)

  return {
    ...old,
    records: updatedRecords,
  }
}

export const useUpdateActiveTimeBasedGoal = (goal: Goal) => {
  const { displayNewAward } = useContext(NewAwardModalContext)
  const { mutate } = useMutation({
    mutationFn: (minutesToAdd: number) => {
      return updateGoalProgress({ id: goal.id, records: getOptimisticGoal(minutesToAdd, goal).records })
    },
    onMutate: async (minutesToAdd, context) => {
      // update optimistic record
      context.client.setQueryData(getQueryKey(), (old: Goal) => getOptimisticGoal(minutesToAdd, old))

      return null
    },
    onSuccess(data, variables, onMutateResult, context) {
      context.client.setQueryData(getQueryKey(), data.updatedGoal)
      if (data.claimedAwards.length > 0) {
        displayNewAward(data.claimedAwards[0])
      }
    },
  })

  return {
    addMinutes: mutate,
  }
}
