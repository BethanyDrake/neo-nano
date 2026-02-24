import { NewAwardModal, NewAwardModalProvider } from '@/lib/awards/NewAwardModal'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { WordCounter } from '@/lib/tools/wordCountTool/WordCounter'
import { UnderDevelopmentMessage } from '@/lib/UnderDevelopmentMessage'

const TimerPage = () => {
  return (
    <NewAwardModalProvider>
    <GutteredPage>
       <UnderDevelopmentMessage upcomingChanges={[{description: 'add words to todays total', issueId: 239}]}/>
     
      <WordCounter />
    </GutteredPage>
    <NewAwardModal/>
    </NewAwardModalProvider>
  )
}

export default TimerPage