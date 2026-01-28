import { NewAwardModal, NewAwardModalProvider } from '@/lib/awards/NewAwardModal'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { Timer } from '@/lib/tools/timer'
import { UnderDevelopmentMessage } from '@/lib/UnderDevelopmentMessage'

const TimerPage = () => {
  return (
    <NewAwardModalProvider>
    <GutteredPage>
       <UnderDevelopmentMessage upcomingChanges={[{description: 'enter word count after a sprint', issueId: 216}, {description: 'graph wpm over a sprint session', issueId: 217}]}/>
     
      <Timer />
    </GutteredPage>
    <NewAwardModal/>
    </NewAwardModalProvider>
  )
}

export default TimerPage
