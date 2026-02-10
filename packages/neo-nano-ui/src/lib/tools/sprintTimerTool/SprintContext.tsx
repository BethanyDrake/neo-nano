import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn'
import {
  Sprint,
  getMySprintLog as _getMySprintLog,
  completePrivateSprint as _completePrivateSprint,
  createPrivateSprint as _createPrivateSprint,
  cancelPrivateSprint as _cancelPrivateSprint,
  CompletedSprint,
} from '@/lib/serverFunctions/sprints/recordPrivateSprint'
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type SprintContextType = {
  startSprint: (durationSeconds: number) => Promise<void>
  cancelSprint: () => Promise<void>
  completeSprint: (adjustedDurationSeconds: number, wordCount: number) => Promise<void>
  sprintLog: CompletedSprint[]
  activeSprint: Sprint | null
}
const SprintContext = createContext<SprintContextType>({
  sprintLog: [],
  activeSprint: null,
  startSprint: function (): Promise<void> {
    throw new Error('Function not implemented.')
  },
  cancelSprint: function (): Promise<void> {
    throw new Error('Function not implemented.')
  },
  completeSprint: function (): Promise<void> {
    throw new Error('Function not implemented.')
  },
})

export const useSprintContext =  () => useContext(SprintContext)

export const SprintContextProvider = ({ children }: PropsWithChildren) => {
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null)
  const [sprintLog, setSprintLog] = useState<CompletedSprint[]>([])
  const isLoggedIn = useIsLoggedIn()

  useEffect(() => {
    if (isLoggedIn) {
      _getMySprintLog().then(setSprintLog)
    }
  }, [isLoggedIn])

  const startSprint = useCallback(
    async (durationSeconds: number) => {
      const startTime = new Date()
      if (isLoggedIn) {
        await _createPrivateSprint(startTime, durationSeconds).then(setActiveSprint)
      } else {
        setActiveSprint({ durationSeconds, id: `${sprintLog.length + 1}`, startTime, visibility: 'private' })
      }
    },
    [isLoggedIn, sprintLog],
  )

  const cancelSprint = useCallback(async () => {
    if (!activeSprint) return
    if (isLoggedIn) {
      await _cancelPrivateSprint(activeSprint.id)
    }
    setActiveSprint(null)
  }, [activeSprint, isLoggedIn])

  const completeSprint = useCallback(
    async (durationSeconds: number, wordCount: number) => {
      if (!activeSprint) throw Error('No active sprint')
      if (isLoggedIn) {
        await _completePrivateSprint(activeSprint?.id, durationSeconds, wordCount)
        _getMySprintLog().then(setSprintLog)
      } else {
        setSprintLog((oldLog) => [
          {
            ...activeSprint,
            wordCount,
            durationSeconds,
            participationState: 'completed',
          },
          ...oldLog,
        ])
      }
      setActiveSprint(null)
    },
    [activeSprint, isLoggedIn],
  )

  const value = useMemo(() => {
    return { completeSprint, cancelSprint, startSprint, sprintLog, activeSprint }
  }, [activeSprint, cancelSprint, completeSprint, sprintLog, startSprint])

  return <SprintContext.Provider value={value}> {children} </SprintContext.Provider>
}
