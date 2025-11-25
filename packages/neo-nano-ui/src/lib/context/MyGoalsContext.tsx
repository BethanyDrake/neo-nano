'use client'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import { Goal } from '@/lib/types/forum.types'
import { getMyGoals } from '../serverFunctions/goals/getMyGoals'

const MyGoalContext = createContext<{
  isLoading: boolean
  goals: Goal[]
  setGoals: (goals: Goal[]) => void
}>({
  isLoading: false,
  goals: [],
  setGoals: () => Promise.resolve(),
})

export const useMyGoalContext = () => useContext(MyGoalContext)

export const MyGoalContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true)
  const [goals, setGoals] = useState<Goal[]>([])

  useEffect(() => {
    setIsLoading(true)
    getMyGoals().then(setGoals).then(() => setIsLoading(false))
  }, [])

  const value = useMemo(() => {
    return { isLoading,  goals, setGoals, }
  }, [isLoading, goals, setGoals])

  return <MyGoalContext.Provider value={value}>{children}</MyGoalContext.Provider>
}
