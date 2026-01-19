import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { Timer } from '@/lib/tools/timer'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

const TimerPage = () => {
    const queryClient = new QueryClient()
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
    <GutteredPage>
      <Timer />
    </GutteredPage>
    </HydrationBoundary>
  )
}

export default TimerPage
