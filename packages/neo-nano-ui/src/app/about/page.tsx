import { TeamMembers } from '@/lib/about/TeamMembers'
import { TechnologyItems } from '@/lib/about/TechnologyItems'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { Section } from '@/lib/layoutElements/Section'
import { Centered } from '@/lib/layoutElements/flexLayouts'

const AboutPage = () => {
  return (
    <GutteredPage>
      <Centered>
        <h1>About</h1>
      </Centered>

      <Section title="Team">
        <TeamMembers />
      </Section>

      <Section title={'Technology'}>
        <TechnologyItems />
      </Section>
    </GutteredPage>
  )
}

const Page = () => {
  return <AboutPage />
}

export default Page
