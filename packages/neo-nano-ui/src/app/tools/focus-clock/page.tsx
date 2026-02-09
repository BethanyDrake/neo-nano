import { NewAwardModal, NewAwardModalProvider } from '@/lib/awards/NewAwardModal'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { Clock } from '@/lib/tools/focusClock/clock'


const FocusClockPage = () => {
  return (
    <NewAwardModalProvider>
    <GutteredPage>
      <Clock />
    </GutteredPage>
    <NewAwardModal/>
    </NewAwardModalProvider>
  )
}

export default FocusClockPage
