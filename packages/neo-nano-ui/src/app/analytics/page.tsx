import { TrophyCounts } from '@/lib/analytics/AwardCounts'
import FunnelSummaryChart from '@/lib/analytics/FunnelSummaryChart'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { Centered, Column } from '@/lib/layoutElements/flexLayouts'
import { Section } from '@/lib/layoutElements/Section'
import { getPyramidData } from '@/lib/serverFunctions/analytics/getPyramidData'
import { getTrophyCounts } from '@/lib/serverFunctions/analytics/getTrophyCounts'

const Page = async () => {
  const awardCounts = await getTrophyCounts()
  const milestoneUserCounts = await getPyramidData()
  return (
    <GutteredPage>
      <Column>
      <Centered>
        <h1>Analytics</h1>
      </Centered>
      
      <Section title="Pyramid of Progress">
        <Centered>
            <FunnelSummaryChart milestoneUserCounts={milestoneUserCounts} />
        </Centered>
      </Section>
         <Section title="Trophies Awarded">
        <TrophyCounts awardCounts={awardCounts} />
      </Section>
      </Column>
    </GutteredPage>
  )
}

export default Page
