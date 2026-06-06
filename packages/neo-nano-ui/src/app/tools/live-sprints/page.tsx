'use client'

import { Column, Row } from '@/lib/layoutElements/flexLayouts'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import {
  getPastRecentSprints,
  getUpcomingPublicSprints,
} from '@/lib/serverFunctions/sprints/publicSprint'
import { Sprint } from '@/lib/serverFunctions/sprints/recordPrivateSprint'
import { PastSprintCard, UpcomingSprintCard } from '@/lib/tools/liveWritingSprints/SprintCard'
import { SprintScheduler } from '@/lib/tools/liveWritingSprints/SprintScheduler'
import { UnderDevelopmentMessage } from '@/lib/UnderDevelopmentMessage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { minutesToMilliseconds } from 'date-fns'

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

  const client = useQueryClient()

  const onScheduled = (data: Sprint) => {
    client.setQueryData(['upcoming-sprints'], [data, ...(upcomingSprints || [])])
  }

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
        <SprintScheduler onScheduled={onScheduled} />
        <h4>Upcoming Sprints:</h4>
        <Row style={{ flexWrap: 'wrap' }}>
          {(upcomingSprints ?? []).map(({ id, startTime, durationSeconds }) => (
            <UpcomingSprintCard key={id} id={id} startTime={startTime} durationSeconds={durationSeconds} />
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
