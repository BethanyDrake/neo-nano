import { NewAwardModal, NewAwardModalProvider } from '@/lib/awards/NewAwardModal'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { Timer } from '@/lib/tools/timer'

const TimerPage = () => {
  return (
    <NewAwardModalProvider>
    <GutteredPage>
      <Timer />
    </GutteredPage>
    <NewAwardModal/>
    </NewAwardModalProvider>
  )
}

export default TimerPage
