'use client'
import modalStyles from '@/lib/modals/Modal.module.css'
import { createContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMyUpcomingSprints } from '@/lib/serverFunctions/sprints/publicSprint'
import { Sprint } from '@/lib/serverFunctions/sprints/recordPrivateSprint'
import { differenceInMilliseconds, secondsToMilliseconds } from 'date-fns'
import { Centered, Column } from '@/lib/layoutElements/flexLayouts'
import { formatTimeString, getExpiryTimestamp } from '../sprintTimerTool/Timer'
import { useTimer } from 'react-timer-hook'

export const LiveSprintModalContext = createContext<{
  activeSprint?: Sprint
  closeModal: () => void
}>({
  activeSprint: undefined,
  closeModal: () => {},
})

export const myActiveSprintQueryKey = ['my-upcoming-sprints']

const Timer_InProgress = ({ durationSeconds }: { durationSeconds: number }) => {
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: getExpiryTimestamp(durationSeconds),
  })

  return (
    <div>
      <Centered>
        <h1>Sprint!</h1>
      </Centered>
      <div>{formatTimeString({ hours, minutes, seconds })}</div>
    </div>
  )
}

export const LiveSprintModal = () => {
  const { data: myUpcomingLiveSprints } = useQuery({
    queryKey: ['my-upcoming-sprints'],
    queryFn: () => getMyUpcomingSprints(),
  })

  const nextSprint = useMemo(
    () => myUpcomingLiveSprints && myUpcomingLiveSprints.length > 0 && myUpcomingLiveSprints[0],
    [myUpcomingLiveSprints],
  )
  const [state, setState] = useState<'closed' | 'in-progress' | 'finished'>('closed')

  useEffect(() => {
    if (!nextSprint) {
      return
    }
    const timeUntilStarts = differenceInMilliseconds(nextSprint.startTime, Date.now())
    console.log({ timeUntilStarts })
    const timeout1 = setTimeout(() => {
      setState('in-progress')
    }, timeUntilStarts)

    const timeout2 = setTimeout(
      () => {
        setState('finished')
      },
      timeUntilStarts + secondsToMilliseconds(nextSprint.durationSeconds),
    )

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
    }
  }, [nextSprint])

  if (state === 'closed' || !nextSprint) {
    return null
  }

  return (
    <>
      <div className={modalStyles.modal}>
        <Column>
          {state === 'in-progress' && <Timer_InProgress durationSeconds={nextSprint.durationSeconds} />}
          {state === 'finished' && <div>Done!</div>}
        </Column>
      </div>
      <div
        onClick={() => {
          setState('closed')
        }}
        className={modalStyles['modal-overlay']}
      />
    </>
  )
}
