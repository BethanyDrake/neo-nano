import { NewAwardModal, NewAwardModalProvider } from '@/lib/awards/NewAwardModal'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { DateSafetyMessage } from '@/lib/tools/wordCountTool/DataSafetyMessage'
import { WordCounter } from '@/lib/tools/wordCountTool/WordCounter'

const TimerPage = () => {
  return (
    <NewAwardModalProvider>
    <GutteredPage>

        <DateSafetyMessage />
      
      <WordCounter />
    </GutteredPage>
    <NewAwardModal/>
    </NewAwardModalProvider>
  )
}

export default TimerPage