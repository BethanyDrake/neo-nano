import { Column, Row } from '@/lib/layoutElements/flexLayouts'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { PastLiveSprint, PastSprintCard, UpcomingLiveSprint, UpcomingSprintCard } from '@/lib/tools/liveWritingSprints/SprintCard'
import { UnderDevelopmentMessage } from '@/lib/UnderDevelopmentMessage'
import { addMinutes} from 'date-fns'


const upcomingSprints: UpcomingLiveSprint[] = [
    {id: '1', startTime: new Date(), durationSeconds: 3 * 60,},
   {id: '2', startTime: addMinutes(new Date(), 5), durationSeconds: 5 * 60,}
]

const pastSprints: PastLiveSprint[] = [
    {id: '3', startTime: addMinutes(new Date(), -5), durationSeconds: 3 * 60,},
   {id: '4', startTime: addMinutes(new Date(), -10), durationSeconds: 5 * 60,},
      {id: '5', startTime: addMinutes(new Date(), -15), durationSeconds: 5 * 60,}
]



const LiveSprintPage = () => {
  return (
    <GutteredPage>
      <UnderDevelopmentMessage upcomingChanges={[
        { description: 'view upcoming sprints' },
        { description: 'register for an upcoming sprint' },
        { description: 'open a countdown model when the sprint starts' },
        { description: 'enter your wordcount when the sprint ends' },
        { description: 'view a wordcount leaderboard' },
        { description: 'view past sprints' },
   
        ]} />
        <Column>
      <h4>Upcoming Sprints:</h4>
      <Row style={{flexWrap: 'wrap'}}>{upcomingSprints.map(({id, startTime, durationSeconds}) => <UpcomingSprintCard key="id" id={id} startTime={startTime} durationSeconds={durationSeconds}/>)}</Row>

      <h4>Past Sprints:</h4>
        <Row style={{flexWrap: 'wrap'}}>{pastSprints.map(({id, startTime, durationSeconds}) => <PastSprintCard key="id" id={id} startTime={startTime} durationSeconds={durationSeconds}/>)}</Row>
</Column>
    </GutteredPage>
  )
}

export default LiveSprintPage
