'use client'
import { startOfToday } from 'date-fns'
import { getDateAsString } from '../../misc'
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn'
import { getActiveGoalWithMetric } from '../../serverFunctions/goals/getActiveGoal'
import { useMutation, useQuery } from '@tanstack/react-query'
import { dateToChallengeDay } from '../../serverFunctions/goals/goalUtils'
import { Goal, Metric } from '../../types/forum.types'
import { changeAtIndex } from '../../goalTracker/recordUtils'
import { updateGoalProgress } from '../../serverFunctions/goals/updateGoalProgress'
import { useContext } from 'react'
import { NewAwardModalContext } from '../../awards/NewAwardModal'

const getQueryKey = (metric: Metric) => {
  const today = getDateAsString(startOfToday())
  const queryKey = ['active-goal', `metric=${metric}`, today]
  return queryKey
}

export const useActiveGoal = (metric: Metric) => {
  const isLoggedIn = useIsLoggedIn()
  const today = getDateAsString(startOfToday())

  const { isLoading, data, error } = useQuery({
    queryKey: getQueryKey(metric),
    queryFn: () => getActiveGoalWithMetric(today, metric),
    enabled: isLoggedIn,
  })
  return {
    isLoading,
    goal: data,
    error,
  }
}

const getOptimisticGoal = (valueToAdd: number, old: Goal): Goal => {
  const today = getDateAsString(startOfToday())
  const challengeDay = dateToChallengeDay(old.startDate, today)
  const previousTotal = old.records[challengeDay] ?? 0
  const updatedRecords = changeAtIndex(old.records, challengeDay, previousTotal + valueToAdd)

  return {
    ...old,
    records: updatedRecords,
  }
}

export const useUpdateActiveGoal = (goal: Goal) => {
  const { displayNewAward } = useContext(NewAwardModalContext)
  const { mutate } = useMutation({
    mutationFn: (valueToAdd: number) => {
      return updateGoalProgress({ id: goal.id, records: getOptimisticGoal(valueToAdd, goal).records })
    },
    onMutate: async (valueToAdd, context) => {
      // update optimistic record
      context.client.setQueryData(getQueryKey(goal.metric), (old: Goal) => getOptimisticGoal(valueToAdd, old))

      return null
    },
    onSuccess(data, variables, onMutateResult, context) {
      context.client.setQueryData(getQueryKey(goal.metric), data.updatedGoal)
      if (data.claimedAwards.length > 0) {
        displayNewAward(data.claimedAwards[0])
      }
    },
  })

  return {
    addValue: mutate,
  }
}
