import { NewAwardModal, NewAwardModalProvider } from '@/lib/awards/NewAwardModal'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { Timer } from '@/lib/tools/SprintTimer/timer'

import { UnderDevelopmentMessage } from '@/lib/UnderDevelopmentMessage'

const TimerPage = () => {
  return (
    <NewAwardModalProvider>
    <GutteredPage>
       <UnderDevelopmentMessage upcomingChanges={[{description: 'graph wpm over a sprint session', issueId: 217}]}/>
     
      <Timer />
    </GutteredPage>
    <NewAwardModal/>
    </NewAwardModalProvider>
  )
}

export default TimerPage
