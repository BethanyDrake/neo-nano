import { ClientSideOnly } from '@/lib/ClientSideOnly'
import { ChallengeCountDown } from '@/lib/landingPage/ChallengeCountDown'
import { GetStartedSection } from '@/lib/landingPage/GetStartedSection'
import { Column } from '@/lib/layoutElements/flexLayouts'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { TextLinePlaceHolder } from '@/lib/layoutElements/Placeholders'
import Image from 'next/image'
import logoV4 from '@/lib/media/logo-v4.png'
import { NovemberEventSchema, MidYearNoveletteEventSchema } from '@/lib/landingPage/schema.org'
import { ProjectHighlight } from '@/lib/landingPage/ProjectHighlight'
import { getFeaturedProject } from '@/lib/serverFunctions/projects/getFeaturedProject'
import { DotiDivider } from '@/lib/layoutElements/dotiContainer'
import { FeaturesSection } from '../lib/landingPage/FeaturesSection'
import { BrainstormingPromptSection } from '@/lib/landingPage/BrainstormingPromptSection'


export default async function Home() {
  const featuredProject = await getFeaturedProject()
  return (
    <GutteredPage>
      <div style={{ textAlign: 'center', minHeight: '75px' }}>
        <h1 style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 'x-large' }}>The Mid-Year Novelette</h1>

        <ClientSideOnly fallback={<TextLinePlaceHolder />}>
          <ChallengeCountDown />
        </ClientSideOnly>

        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', alignItems:"center"}}>
      
        <Image
          fetchPriority="high"
          loading="eager"
          alt="Novel November"
          width={300}
          height={300}
          src={logoV4}
          placeholder="blur"
        />
        <BrainstormingPromptSection/>
        </div>

      </div>

      <details>
        <NovemberEventSchema />
        <summary>
          <h2>{"What's Novel November?"}</h2>
        </summary>
        <h3>History:</h3>
        <p>
          {
            "Previously, 'National Novel Writing Month' (NaNoWriMo) was a world-wide writing challenge run by a non-profit organisation. The official website and forums shut down in March 2025, but the challenge lives on."
          }
        </p>
        <h3>The Challenge:</h3>
        <ul>
          <li>50,000 words</li>
          <li>30 days, starting November 1st</li>
          <li>A full, completed draft of a new novel</li>
          <li>No editing, no second guessing, no hesitation.</li>
        </ul>
      </details>

      <details style={{ display: 'none' }}>
        <summary>
          <h2>{"What's the 80 Hour Edit?"}</h2>
        </summary>
        <h3>Premise:</h3>
        <p>{'If you wrote a novel this November, then you might want to spend some time editing in the new year.'}</p>
        <p>{'Fix the major plotholes, rename the main character, and reduce the typos to a respectable number.'}</p>
        <h3>The Challenge:</h3>
        <ul>
          <li>80 hours</li>
          <li>60 days, starting January 1st</li>
          <li>Be focused. Be ruthless. Get it ready for the world.</li>
        </ul>
      </details>

      <details style={{ display: 'none' }}>
        <MidYearNoveletteEventSchema />
        <summary>
          <h2>{"What's the Mid-Year Novelette?"}</h2>
        </summary>
        <h3>Premise:</h3>
        <p>{"November doesn't work for you? 50,000 words isn't the right target? Just want to write more?"}</p>
        <p>
          {
            'The Mid-Year Novelette is a more flexible, less intense alternative to the main writing challenge. The default word target is set at 15K, but choose whatever works for you.'
          }
        </p>
        <h3>The Challenge:</h3>
        <ul>
          <li>15,000 words (or whatever)</li>
          <li>31 days, starting July 1st</li>
        </ul>
      </details>
      <GetStartedSection />
      <Column>
        <FeaturesSection />
      </Column>
      <DotiDivider />
      {featuredProject && <ProjectHighlight project={featuredProject.project} user={featuredProject.user} />}
    </GutteredPage>
  )
}
