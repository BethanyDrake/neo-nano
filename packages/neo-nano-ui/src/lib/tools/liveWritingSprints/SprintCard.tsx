'use client'
import { Sprint } from '@/lib/serverFunctions/sprints/recordPrivateSprint'
import classNames from './liveSprints.module.css'
import { TextButton } from '@/lib/buttons/BasicButton'
import { getPublicSprintLog, registerForPublicSprint } from '@/lib/serverFunctions/sprints/publicSprint'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPerson, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useMyUpcomingLiveSprints } from './useMyUpcomingSprints'

export type UpcomingLiveSprint = Omit<Sprint, 'visibility'> & { participants: number }
export type PastLiveSprint = Omit<Sprint, 'visibility'> & { participants: number }

export const formatStartTime = (startTime: Date) => {
  return startTime.toLocaleTimeString(undefined, { hourCycle: 'h24', timeStyle: 'short' })
}

export const UpcomingSprintCard = ({ id, startTime, durationSeconds, participants }: UpcomingLiveSprint) => {
  const { data: myUpcomingLiveSprints, refetch, isFetching } = useMyUpcomingLiveSprints()
  const { mutate: doRegister, isPending } = useMutation({
    mutationFn: () => registerForPublicSprint(id),
    onSuccess: () => {
      refetch()
    },
  })

  const amIRegistered = myUpcomingLiveSprints?.find((sprint) => sprint.id === id)
  const isLoading = isPending || isFetching

  return (
    <div className={classNames.expandableCard}>
      <div className={classNames.sprintId}>#{id}</div>
      <div className={classNames.startTime}>{formatStartTime(startTime)}</div>
      <div className={classNames.duration}>{durationSeconds / 60}m</div>

      <div>
        <FontAwesomeIcon icon={faPerson} /> {participants}
      </div>

      <div style={{ fontWeight: 'bold', fontSize: 'medium', padding: '5px' }}>
        {amIRegistered && <div style={{ padding: '1px', color: 'var(--grey-dark)' }}>registered</div>}

        {isLoading && <FontAwesomeIcon spin={true} icon={faSpinner} />}
        {!isLoading && !amIRegistered && (
          <TextButton buttonProps={{ onClick: () => doRegister(), disabled: isPending, style: { fontSize: 'medium' } }}>
            register
          </TextButton>
        )}
      </div>
    </div>
  )
}

const PastSprintLog = ({ sprintId }: { sprintId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['sprint-log', sprintId],
    queryFn: () => getPublicSprintLog(sprintId),
    refetchOnMount: true,
  })

  return (
    <>
      {isLoading && <FontAwesomeIcon spin={true} icon={faSpinner} />}
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
    </>
  )
}

export const PastSprintCard = ({ startTime, durationSeconds, id, participants }: PastLiveSprint) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={classNames.pastSprintCard} onClick={() => setIsOpen(true)}>
      <div className={classNames.sprintId}>#{id}</div>
      <div className={classNames.startTime}>{formatStartTime(startTime)}</div>
      <div className={classNames.duration}>{durationSeconds / 60}m</div>
      <div>
        <FontAwesomeIcon icon={faPerson} /> {participants}
      </div>
      {isOpen && <PastSprintLog sprintId={id} />}
    </div>
  )
}
