'use client'
import modalStyles from '@/lib/modals/Modal.module.css'
import { createContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { completePublicSprint, getPublicSprintLog } from '@/lib/serverFunctions/sprints/publicSprint'
import { Sprint } from '@/lib/serverFunctions/sprints/recordPrivateSprint'
import { differenceInMilliseconds, secondsToMilliseconds } from 'date-fns'
import { Column, LeftRow } from '@/lib/layoutElements/flexLayouts'
import { formatTimeString, getExpiryTimestamp } from '../sprintTimerTool/Timer'
import { useTimer } from 'react-timer-hook'
import { useForm } from 'react-hook-form'
import { BasicButton } from '@/lib/buttons/BasicButton'
import formClasses from '@/lib/expandableForms/form.module.css'
import inProgressSprintImage from './in-progress-sprint.png'
import finishedSprintImage from './sprint-finished.png'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPerson, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useMyUpcomingLiveSprints } from './useMyUpcomingSprints'

export const LiveSprintModalContext = createContext<{
  activeSprint?: Sprint
  closeModal: () => void
}>({
  activeSprint: undefined,
  closeModal: () => {},
})

const SprintFinishedImage = () => (
  <Image
    alt={'Silhouette of the winner crossing the finish line.'}
    width={300}
    height={300}
    src={finishedSprintImage}
  />
)

const LiveSprint_InProgress = ({ durationSeconds, sprintId }: { durationSeconds: number; sprintId: string }) => {
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: getExpiryTimestamp(durationSeconds),
  })

  const { data: sprintLog, isLoading } = useQuery({
    queryKey: ['sprint-log', sprintId],
    queryFn: () => getPublicSprintLog(sprintId),
  })

  return (
    <Column style={{ alignItems: 'center' }}>
      <h1>Sprint!</h1>
      {!isLoading && (
        <div>
          <FontAwesomeIcon icon={faPerson} /> {sprintLog?.length || 0}
        </div>
      )}

      <Image
        alt={'Silhouette of participants sprinting towards their goal.'}
        width={300}
        height={300}
        src={inProgressSprintImage}
      />

      <div style={{ fontSize: 'xx-large', translate: '0px -50px' }}>
        {formatTimeString({ hours, minutes, seconds })}
      </div>
    </Column>
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
    <Column style={{ alignItems: 'center' }}>
      <h1>Done!</h1>

      <SprintFinishedImage />

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
    </Column>
  )
}

const LiveSprint_Review = ({ sprintId }: { sprintId: string }) => {
  const { data, status } = useQuery({
    queryKey: ['sprint-log', sprintId],
    queryFn: () => getPublicSprintLog(sprintId),
    refetchInterval: 5000,
  })

  return (
    <Column style={{ alignItems: 'center' }}>
      <h1>Review</h1>
      <SprintFinishedImage />
      <div>
        {status === 'pending' && <FontAwesomeIcon spin={true} icon={faSpinner} />}
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
    </Column>
  )
}
export const LiveSprintModal = () => {
  const { data: myUpcomingLiveSprints } = useMyUpcomingLiveSprints()

  const [closedSprints, setClosedSprints] = useState<string[]>([])

  const nextSprint = useMemo(
    () => (myUpcomingLiveSprints && myUpcomingLiveSprints.length > 0 ? myUpcomingLiveSprints[0] : undefined),
    [myUpcomingLiveSprints],
  )

  const [state, setState] = useState<'closed' | 'in-progress' | 'finished' | 'review'>('closed')

  useEffect(() => {
    if (!nextSprint || closedSprints.some((closedSprint) => closedSprint === nextSprint.id)) {
      return
    }
    const timeUntilStarts = differenceInMilliseconds(nextSprint.startTime, Date.now())

    if (state === 'closed') {
      const timeout1 = setTimeout(
        () => {
          setState('in-progress')
        },
        Math.max(timeUntilStarts, 0),
      )

      return () => clearTimeout(timeout1)
    }

    if (state === 'in-progress') {
      const timeout2 = setTimeout(
        () => {
          setState('finished')
        },
        Math.max(timeUntilStarts + secondsToMilliseconds(nextSprint.durationSeconds), 0),
      )

      return () => {
        clearTimeout(timeout2)
      }
    }
  }, [closedSprints, nextSprint, state])

  if (state === 'closed' || !nextSprint) {
    return null
  }

  return (
    <>
      <div className={modalStyles.modal}>
        <Column>
          {state === 'in-progress' && (
            <LiveSprint_InProgress durationSeconds={nextSprint.durationSeconds} sprintId={nextSprint.id} />
          )}
          {state === 'finished' && <LiveSprint_Done onSuccess={() => setState('review')} sprintId={nextSprint.id} />}
          {state === 'review' && <LiveSprint_Review sprintId={nextSprint.id} />}
        </Column>
      </div>
      <div
        onClick={() => {
          if (nextSprint) {
            setClosedSprints([...closedSprints, nextSprint.id])
          }
          setState('closed')
        }}
        className={modalStyles['modal-overlay']}
      />
    </>
  )
}
