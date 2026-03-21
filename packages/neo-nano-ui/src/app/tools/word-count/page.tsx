import { NewAwardModal, NewAwardModalProvider } from '@/lib/awards/NewAwardModal'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { DateSafetyMessage } from '@/lib/tools/wordCountTool/DataSafetyMessage'
import { WordCounter } from '@/lib/tools/wordCountTool/WordCounter'
import { UnderDevelopmentMessage } from '@/lib/UnderDevelopmentMessage'

const TimerPage = () => {
  return (
    <NewAwardModalProvider>
    <GutteredPage>
       <UnderDevelopmentMessage upcomingChanges={[
        {description: 'update project total (cumulative)', issueId: 242}]
        }/>

        <DateSafetyMessage />
      
      <WordCounter />
    </GutteredPage>
    <NewAwardModal/>
    </NewAwardModalProvider>
  )
}

export default TimerPage