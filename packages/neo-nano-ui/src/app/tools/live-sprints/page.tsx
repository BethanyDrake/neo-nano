'use client'
import { BasicButton } from '@/lib/buttons/BasicButton'
import { Column, Row } from '@/lib/layoutElements/flexLayouts'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import {
  createPublicSprint,
  getPastRecentSprints,
  getUpcomingPublicSprints,
} from '@/lib/serverFunctions/sprints/publicSprint'
import { PastSprintCard, UpcomingSprintCard } from '@/lib/tools/liveWritingSprints/SprintCard'
import { UnderDevelopmentMessage } from '@/lib/UnderDevelopmentMessage'
import { useMutation, useQuery } from '@tanstack/react-query'
import { addMinutes, minutesToMilliseconds, minutesToSeconds } from 'date-fns'

const LiveSprintPage = () => {
  const { data: upcomingSprints } = useQuery({
    queryKey: ['upcoming-sprints'],
    queryFn: getUpcomingPublicSprints,
  })

  const { data: pastSprints } = useQuery({
    queryKey: ['past-sprints'],
    queryFn: () => getPastRecentSprints(6),
    staleTime: minutesToMilliseconds(1),
  })
  const { mutate: scheduleSprint } = useMutation({
    mutationFn: () => {
      console.log('scheduleSprint', addMinutes(Date.now(), 5))
      return createPublicSprint(addMinutes(Date.now(), 5), minutesToSeconds(5))
    },
    mutationKey: ['schedule-sprint'],
    onSuccess(data, _variables, _onMutateResult, context) {
      context.client.setQueryData(['upcoming-sprints'], [data, ...(upcomingSprints || [])])
    },
  })

  return (
    <GutteredPage>
      <UnderDevelopmentMessage
        upcomingChanges={[
          { description: 'view upcoming sprints' },
          { description: 'register for an upcoming sprint' },
          { description: 'open a countdown model when the sprint starts' },
          { description: 'enter your wordcount when the sprint ends' },
          { description: 'view a wordcount leaderboard' },
          { description: 'view past sprints' },
        ]}
      />
      <Column>
        <BasicButton buttonProps={{ onClick: () => scheduleSprint() }}>Schedule Sprint</BasicButton>
        <h4>Upcoming Sprints:</h4>
        <Row style={{ flexWrap: 'wrap' }}>
          {(upcomingSprints ?? []).map(({ id, startTime, durationSeconds }) => (
            <UpcomingSprintCard key={id} id={id} startTime={startTime} durationSeconds={durationSeconds}/>
          ))}
        </Row>

        <h4>Past Sprints:</h4>
        <Row style={{ flexWrap: 'wrap' }}>
          {(pastSprints || []).map(({ id, startTime, durationSeconds }) => (
            <PastSprintCard key={id} id={id} startTime={startTime} durationSeconds={durationSeconds} />
          ))}
        </Row>
      </Column>
    </GutteredPage>
  )
}

export default LiveSprintPage
