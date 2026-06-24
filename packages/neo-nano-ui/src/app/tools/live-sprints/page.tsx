'use client'

import { Column, Row } from '@/lib/layoutElements/flexLayouts'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import {
  getPastRecentSprints,
  getUpcomingPublicSprints,
} from '@/lib/serverFunctions/sprints/publicSprint'
import { PastSprintCard, UpcomingSprintCard } from '@/lib/tools/liveWritingSprints/SprintCard'
import { SprintScheduler } from '@/lib/tools/liveWritingSprints/SprintScheduler'
import { UnderDevelopmentMessage } from '@/lib/UnderDevelopmentMessage'
import { useQuery } from '@tanstack/react-query'
import { minutesToMilliseconds, secondsToMilliseconds } from 'date-fns'

const LiveSprintPage = () => {
  const { data: upcomingSprints, refetch } = useQuery({
    queryKey: ['upcoming-sprints'],
    queryFn: getUpcomingPublicSprints,
    refetchInterval: secondsToMilliseconds(5)
  })

  const { data: pastSprints } = useQuery({
    queryKey: ['past-sprints'],
    queryFn: () => getPastRecentSprints(6),
    staleTime: minutesToMilliseconds(1),
    refetchInterval: minutesToMilliseconds(1)
  })

  return (
    <GutteredPage>
      <UnderDevelopmentMessage
        upcomingChanges={[
          
        ]}
      />
      <Column>
        <SprintScheduler onScheduled={refetch} />
        <h4>Upcoming Sprints:</h4>
        <Row style={{ flexWrap: 'wrap' }}>
          {(upcomingSprints ?? []).map(({ id, startTime, durationSeconds, participants}) => (
            <UpcomingSprintCard key={id} id={id} startTime={startTime} durationSeconds={durationSeconds} participants={participants}/>
          ))}
        </Row>

        <h4>Past Sprints:</h4>
        <Row style={{ flexWrap: 'wrap' }}>
          {(pastSprints || []).map(({ id, startTime, durationSeconds, participants}) => (
            <PastSprintCard key={id} id={id} startTime={startTime} durationSeconds={durationSeconds} participants={participants} />
          ))}
        </Row>
      </Column>
    </GutteredPage>
  )
}

export default LiveSprintPage
