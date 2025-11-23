

import { TrophyCounts } from "@/lib/analytics/AwardCounts"
import FunnelSummaryChart from "@/lib/analytics/FunnelSummaryChart"
import { GutteredPage } from "@/lib/GutteredPage"
import { Centered } from "@/lib/layout"
import { getPyramidData } from "@/lib/serverFunctions/analytics/getPyramidData"
import { getTrophyCounts } from "@/lib/serverFunctions/analytics/getTrophyCounts"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Suspense } from "react"


const Page =async  () => {
  return (
  <GutteredPage>
    <Centered>
      <h1>Analytics</h1>
    </Centered>
    <Suspense fallback={<FontAwesomeIcon spin icon={faSpinner}/>} ><FunnelSummaryChart milestoneUserCounts={getPyramidData()}/></Suspense>
    <Suspense fallback={<FontAwesomeIcon spin icon={faSpinner}/>}><TrophyCounts awardCountsPromise={getTrophyCounts()} /></Suspense>
  </GutteredPage>)

}

export default Page
