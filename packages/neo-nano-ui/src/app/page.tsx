import { ClientSideOnly } from '@/lib/ClientSideOnly'
import { ChallengeCountDown } from '@/lib/landingPage/ChallengeCountDown'
import { GetStartedSection } from '@/lib/landingPage/GetStartedSection'
import styles from '@/lib/landingPage/page.module.css'
import { Column, Row } from '@/lib/layoutElements/flexLayouts'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faBullseye, faChartLine, faComment, faScissors, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'

const FeatureCard = ({
  title,
  caption,
  icon,
  color,
}: {
  title: string
  caption: string
  icon: IconProp
  color: string
}) => {
  return (
    <div className={styles['feature-card']}>
      <h3>{title}</h3>
      <FontAwesomeIcon color={color} size="8x" icon={icon} />
      <p>{caption}</p>
    </div>
  )
}

const FeaturesSection = () => {
  return (
    <Row style={{ padding: '16px', overflow: 'scroll' }} justifyContent="left">
      <FeatureCard title="Track" caption={'Track your progress each day.'} icon={faChartLine} color={'#d1b1ec'} />
      <FeatureCard
        title="Set Goals"
        // caption={'Aim for 50,000 words in November, or create a custom goal.'}
        caption={'Aim for 80 hours in the new year, or create a custom goal.'}
        icon={faBullseye}
        color={'#1ab394'}
      />
      <FeatureCard
        title="Earn Awards"
        caption={'Celebrate the little wins with trophies along the way.'}
        icon={faTrophy}
        color={'#6e1ab3'}
      />
      <FeatureCard
        title="Socialise"
        caption={"When you're done writing for the day, come hang out in the forums 🤗"}
        icon={faComment}
        color={'#C0E5C8'}
      />
    </Row>
  )
}


export default function Home() {
  return (
    <div
      className={styles.background}
      style={{
        backgroundImage: 'url(https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/bookcase-small.jpg)',
        backgroundSize: '1000px',
      }}
    >
      <div className={styles.main}>
        <div style={{ maxWidth: '100vw', padding: '16px' }}>
          <div style={{ textAlign: 'center', minHeight: '75px' }}>
                    <h1 style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 'x-large' }}>
                      <FontAwesomeIcon icon={faScissors} />
                      The 80 Hour Edit
                      <FontAwesomeIcon icon={faScissors} flip="horizontal" />
                    </h1>
                    
            <ClientSideOnly>
              <ChallengeCountDown />
            </ClientSideOnly>
           
            <Image
              loading="eager"
              alt="Novel November"
              width={300}
              height={300}
              src="https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/logo-v4.png"
            />
          </div>

            <details><summary><h2>{"What's Novel November?"}</h2></summary>
            <h3>History:</h3>
            <p>{"Previously, 'National Novel Writing Month' (NaNoWriMo) was a world-wide writing challenge run by a non-profit organisation. The official website and forums shut down in March 2025, but the challenge lives on."}</p>
            <h3>The Challenge:</h3>
            <ul>
              <li>50,000 words</li>
              <li>30 days, starting November 1st</li>
              <li>A full, completed draft of a new novel</li>
              <li>No editing, no second guessing, no hesitation.</li>
            </ul>
            </details>

                     <details><summary><h2>{"What's the 80 Hour Edit?"}</h2></summary>
            <h3>Premise:</h3>
            <p>{"If you wrote a novel this November, then you might want to spend some time editing in the new year."}</p>
            <p>{"Fix the major plotholes, rename the main character, and reduce the typos to a respectable number."}</p>
             <h3>The Challenge:</h3>
            <ul>
              <li>80 hours</li>
              <li>60 days, starting January 1st</li>
              <li>Be focused. Be ruthless. Get it ready for the world.</li>
            </ul>
            </details>
           <GetStartedSection />
          <Column>
            <FeaturesSection />
   
          </Column>
        </div>
      </div>
    </div>
  )
}
