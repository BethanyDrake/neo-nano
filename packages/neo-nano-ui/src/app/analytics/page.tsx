

import { TrophyCounts } from "@/lib/analytics/AwardCounts"
import { GutteredPage } from "@/lib/GutteredPage"
import { Centered } from "@/lib/layout"
import { getTrophyCounts } from "@/lib/serverFunctions/analytics/getTrophyCounts"
import { Suspense } from "react"


const Page =async  () => {
    
  return <GutteredPage>
    
        <Centered>
            <h1>Analytics</h1>
          </Centered>
    
    <Suspense fallback="loading!"><TrophyCounts awardCountsPromise={getTrophyCounts()} /></Suspense></GutteredPage>
}

export default Page
