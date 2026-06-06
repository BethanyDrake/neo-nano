'use client'
import modalStyles from '@/lib/modals/Modal.module.css'
import { createContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  completePublicSprint,
  getMyUpcomingSprints,
  getPublicSprintLog,
} from '@/lib/serverFunctions/sprints/publicSprint'
import { Sprint } from '@/lib/serverFunctions/sprints/recordPrivateSprint'
import { differenceInMilliseconds, secondsToMilliseconds } from 'date-fns'
import { Centered, Column, LeftRow } from '@/lib/layoutElements/flexLayouts'
import { formatTimeString, getExpiryTimestamp } from '../sprintTimerTool/Timer'
import { useTimer } from 'react-timer-hook'
import { useForm } from 'react-hook-form'
import { BasicButton } from '@/lib/buttons/BasicButton'
import formClasses from '@/lib/expandableForms/form.module.css'

export const LiveSprintModalContext = createContext<{
  activeSprint?: Sprint
  closeModal: () => void
}>({
  activeSprint: undefined,
  closeModal: () => {},
})

export const myActiveSprintQueryKey = ['my-upcoming-sprints']

const LiveSprint_InProgress = ({ durationSeconds }: { durationSeconds: number }) => {
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

const LiveSprint_Done = ({ sprintId, onSuccess }: { sprintId: string; onSuccess: () => void }) => {
  const { handleSubmit, register } = useForm<{
    wordCount: string
    updateActiveGoal: boolean
  }>()

  const { mutate, status } = useMutation({
    mutationFn: (wordCount: number) => completePublicSprint(sprintId, wordCount),
    onSuccess,
  })

  return (
    <div>
      <Centered>
        <h1>Done!</h1>
      </Centered>

      <form
        className={[formClasses.form].join(' ')}
        onSubmit={handleSubmit(({ wordCount }) => {
          mutate(parseInt(wordCount))
        })}
      >
        <LeftRow alignItems="baseline">
          <label htmlFor="wordCount">Enter word count:</label>
          <input type="number" min={0} id="wordCount" {...register('wordCount', { required: true })} />
        </LeftRow>

        <BasicButton isLoading={status === 'pending'}>Submit</BasicButton>
      </form>
    </div>
  )
}

const LiveSprint_Review = ({ sprintId }: { sprintId: string }) => {
  const { data } = useQuery({
    queryKey: ['sprint-review', sprintId],
    queryFn: () => getPublicSprintLog(sprintId),
    refetchInterval: 5000,
  })

  return (
    <div>
      <Centered>
        <h1>Review</h1>
      </Centered>
      {data &&
        data.map(({ wordCount, userId, displayName, participationState }) => {
          if (participationState === 'completed')
            return (
              <div key={userId}>
                <span style={{ fontWeight: 'bold' }}>{displayName}: </span>
                <span>{wordCount} words</span>
              </div>
            )
          else
            return (
              <div key={userId}>
                <span style={{ fontWeight: 'bold', color: 'var(--grey-dark)' }}>{displayName}</span>{' '}
              </div>
            )
        })}
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
  const [state, setState] = useState<'closed' | 'in-progress' | 'finished' | 'review'>('closed')

  useEffect(() => {
    if (!nextSprint) {
      return
    }
    const timeUntilStarts = differenceInMilliseconds(nextSprint.startTime, Date.now())
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
          {state === 'in-progress' && <LiveSprint_InProgress durationSeconds={nextSprint.durationSeconds} />}
          {state === 'finished' && <LiveSprint_Done onSuccess={() => setState('review')} sprintId={nextSprint.id} />}
          {state === 'review' && <LiveSprint_Review sprintId={nextSprint.id} />}
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
