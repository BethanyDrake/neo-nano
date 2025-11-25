import { TrophyCounts } from '@/lib/analytics/AwardCounts'
import FunnelSummaryChart from '@/lib/analytics/FunnelSummaryChart'
import { GutteredPage } from '@/lib/GutteredPage'
import { Centered, Column } from '@/lib/layout'
import { Section } from '@/lib/layoutElements/Section'
import { getPyramidData } from '@/lib/serverFunctions/analytics/getPyramidData'
import { getTrophyCounts } from '@/lib/serverFunctions/analytics/getTrophyCounts'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Suspense } from 'react'

const Page = async () => {
  return (
    <GutteredPage>
      <Column>
      <Centered>
        <h1>Analytics</h1>
      </Centered>
      
      <Section title="Pyramid of Progress">
        <Centered>
          <Suspense fallback={<FontAwesomeIcon spin icon={faSpinner} />}>
            <FunnelSummaryChart milestoneUserCounts={getPyramidData()} />
          </Suspense>
        </Centered>
      </Section>
         <Section title="Trophies Awarded">
      <Suspense fallback={<FontAwesomeIcon spin icon={faSpinner} />}>
        <TrophyCounts awardCountsPromise={getTrophyCounts()} />
      </Suspense>
      </Section>
      </Column>
    </GutteredPage>
  )
}

export default Page
