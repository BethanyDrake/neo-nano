'use client'
import { Sprint } from '@/lib/serverFunctions/sprints/recordPrivateSprint'
import classNames from './liveSprints.module.css'
import { TextButton } from '@/lib/buttons/BasicButton'
import { getPublicSprintLog, registerForPublicSprint } from '@/lib/serverFunctions/sprints/publicSprint'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPerson, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { UserContext } from '@/lib/context/UserContext'
import { myActiveSprintQueryKey } from './LiveSprintModal'

export type UpcomingLiveSprint = Omit<Sprint, 'visibility'>
export type PastLiveSprint = Omit<Sprint, 'visibility'>

export const formatStartTime = (startTime: Date) => {
  return startTime.toLocaleTimeString(undefined, { hourCycle: 'h24', timeStyle: 'short' })
}

export const UpcomingSprintCard = ({ id, startTime, durationSeconds }: UpcomingLiveSprint) => {
  const {
    data: sprintLog,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['sprint-log', id],
    queryFn: () => getPublicSprintLog(id),
  })

  const queryClient = useQueryClient()
  const { mutate: doRegister, isPending } = useMutation({
    mutationFn: () => registerForPublicSprint(id),
    onSuccess: () => {
      refetch()
      queryClient.invalidateQueries({ queryKey: myActiveSprintQueryKey })
    },
  })

  const me = useContext(UserContext)

  const amIRegistered = !!sprintLog?.find(({ userId }) => userId === me?.id)

  return (
    <div className={classNames.expandableCard}>
      <div className={classNames.startTime}>{formatStartTime(startTime)}</div>
      <div className={classNames.duration}>{durationSeconds / 60}m</div>
      {(isLoading || isPending) && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin />{' '}
        </div>
      )}
      {!(isLoading || isPending) && (
        <div>
          <FontAwesomeIcon icon={faPerson} /> {sprintLog?.length || 0}
        </div>
      )}
      <div style={{ fontWeight: 'bold', fontSize: 'medium', padding: '5px' }}>
        {amIRegistered ? (
          <div style={{ padding: '1px', color: 'var(--grey-dark)' }}>registered</div>
        ) : (
          <TextButton
            buttonProps={{ onClick: () => doRegister(), disabled: isPending, style: { fontSize: 'medium' } }}
          >
            register
          </TextButton>
        )}
      </div>
    </div>
  )
}

export const PastSprintCard = ({ startTime, durationSeconds }: PastLiveSprint) => {
  return (
    <div className={classNames.pastSprintCard}>
      <div className={classNames.startTime}>{formatStartTime(startTime)}</div>
      <div className={classNames.duration}>{durationSeconds / 60}m</div>
    </div>
  )
}
