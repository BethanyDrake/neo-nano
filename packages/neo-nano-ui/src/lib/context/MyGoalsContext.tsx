'use client'
import { Goal } from '@/lib/types/forum.types'
import { getMyGoals } from '../serverFunctions/goals/getMyGoals'
import {useQuery, useQueryClient } from '@tanstack/react-query'

export const useMyGoalContext = () => {
  const queryClient = useQueryClient()
  const {data: goals, isLoading} = useQuery({
    queryKey: ['my-goals'],
    queryFn: () => getMyGoals()
  })

  const setGoals = (updatedGoals: Goal[]) => {
    queryClient.setQueryData(['my-goals'], updatedGoals)
  }
  return {goals, isLoading, setGoals}
}

