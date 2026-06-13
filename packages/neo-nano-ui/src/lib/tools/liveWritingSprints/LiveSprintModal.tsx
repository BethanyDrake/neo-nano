'use client'
import modalStyles from '@/lib/modals/Modal.module.css'
import { createContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { completePublicSprint, getPublicSprintLog } from '@/lib/serverFunctions/sprints/publicSprint'
import { Sprint } from '@/lib/serverFunctions/sprints/recordPrivateSprint'
import { addSeconds } from 'date-fns'
import { Column, LeftRow } from '@/lib/layoutElements/flexLayouts'
import { formatTimeString } from '../sprintTimerTool/Timer'
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
import { FloatingSprintButton } from './FloatingSprintButton'
import notStartedSprintImage from './not-started-sprint.png'
import { getNewState } from './stateMachine'

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


const NotStartedSprintImage = () => (
  <Image
    alt={'Silhouette of person resting before a sprint'}
    width={300}
    height={300}
    src={notStartedSprintImage}
  />
)

const LiveSprint_InProgress = ({ durationSeconds, sprintId, startTime }: { durationSeconds: number; sprintId: string, startTime: Date }) => {

  
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: addSeconds(startTime, durationSeconds),
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

const LiveSprint_NotStarted = () => {

  return (
    <Column style={{ alignItems: 'center' }}>
      <h1>Starting soon...</h1>

      <NotStartedSprintImage />

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
  const { data: myUpcomingLiveSprints, refetch } = useMyUpcomingLiveSprints()

  const nextSprint = useMemo(
    () => (myUpcomingLiveSprints && myUpcomingLiveSprints.length > 0 ? myUpcomingLiveSprints[0] : undefined),
    [myUpcomingLiveSprints],
  )
  const [isOpen, setIsOpen] = useState(false)

  const [state, setState] = useState<'not-started' | 'in-progress' | 'finished' | 'review'>('not-started')
  useEffect(() => {
    const {newState, delay} = getNewState(state, nextSprint)

    if (state !== newState) {
      console.log(`updating state ${state} -> ${newState}`, delay)
      const timeoutId = setTimeout(() => {
        setState(newState)
        setIsOpen(true)
      }, delay)

      return () => clearTimeout(timeoutId)
    }
   
  }, [nextSprint, state])

  if (!nextSprint) {
    return null
  }

  return (
    <>
    {<FloatingSprintButton onClick={() => setIsOpen(!isOpen)}/>}
    {isOpen && <>
      <div className={modalStyles.modal}>
        
        <Column>
          {state === 'not-started' && (
            <LiveSprint_NotStarted />
          )}
          {state === 'in-progress' && (
            <LiveSprint_InProgress durationSeconds={nextSprint.durationSeconds} sprintId={nextSprint.id} startTime={nextSprint.startTime}/>
          )}
          {state === 'finished' && <LiveSprint_Done onSuccess={() => setState('review')} sprintId={nextSprint.id} />}
          {state === 'review' && <LiveSprint_Review sprintId={nextSprint.id} />}
        </Column>
      </div>
      <div
        onClick={() => {
          if (state === 'finished' || state === 'review')
          refetch().then(() => {
           setState('not-started')
          })
          setIsOpen(false)
        }}
        className={modalStyles['modal-overlay']}
      /></>}
    </>
  )
}
