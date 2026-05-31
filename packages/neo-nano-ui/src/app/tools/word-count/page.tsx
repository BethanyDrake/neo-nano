import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { DateSafetyMessage } from '@/lib/tools/wordCountTool/DataSafetyMessage'
import { WordCounter } from '@/lib/tools/wordCountTool/WordCounter'

const TimerPage = () => {
  return (
    <GutteredPage>

        <DateSafetyMessage />
      
      <WordCounter />
    </GutteredPage>
  )
}

export default TimerPage