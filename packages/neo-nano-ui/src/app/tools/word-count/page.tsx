import { NewAwardModal, NewAwardModalProvider } from '@/lib/awards/NewAwardModal'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { WordCounter } from '@/lib/tools/wordCountTool/WordCounter'
import { UnderDevelopmentMessage } from '@/lib/UnderDevelopmentMessage'

const TimerPage = () => {
  return (
    <NewAwardModalProvider>
    <GutteredPage>
       <UnderDevelopmentMessage upcomingChanges={[
        {description: 'update today\'s total (cumulative)', issueId:243},
        {description: 'update project total (cumulative)', issueId: 242}]
        }/>
     
      <WordCounter />
    </GutteredPage>
    <NewAwardModal/>
    </NewAwardModalProvider>
  )
}

export default TimerPage