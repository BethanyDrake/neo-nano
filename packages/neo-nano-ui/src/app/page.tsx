import { ChallengeCountDown } from '@/lib/ChallengeCountDown'
import { ClientSideOnly } from '@/lib/ClientSideOnly'
import { Column, Row } from '@/lib/layout'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faBullseye, faChartLine, faComment, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import styles from '@/lib/landingPage/page.module.css'
import { GetStartedSection } from '@/lib/landingPage/GetStartedSection'
import { Section } from '@/lib/layoutElements/Section'

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
  const body = (
    <Row style={{ padding: '16px', overflow: 'scroll' }} justifyContent="left">
      <FeatureCard title="Track" caption={'Track your progress each day.'} icon={faChartLine} color={'#d1b1ec'} />
      <FeatureCard
        title="Set Goals"
        caption={'Aim for 50,000 words in November, or create a custom goal.'}
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

  const title = 'Features'
  return <Section title={title}>{body}</Section>
}

const ChallengeBody = () => {
  const rules = [
    '50,000 words',
    '30 days',
    'A full, completed draft of a new novel',
    'No editing, no second guessing, no hesitation',
    'Get. It. Done!',
  ]

  return (
    <ul style={{ marginLeft: '1em' }}>
      {rules.map((rule) => (
        <li key={rule}>{rule}</li>
      ))}
    </ul>
  )
}

const ChallengeSection = () => {
  const title = 'The Challenge'
  const body = <ChallengeBody />
  return <Section title={title}>{body}</Section>
}

const HistorySection = () => {
  const title = 'History'
  const body =
    "Previously, 'National Novel Writing Month' (NaNoWriMo) was a world-wide writing challenge run by a non-profit organisation. The official website and forums shut down in March 2025, but the challenge lives on."
  return <Section title={title}><p>{body}</p></Section>
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
            <h1 className={styles.h1}>Novel November</h1>
            <ClientSideOnly>
              <ChallengeCountDown />
            </ClientSideOnly>
            <Image
              alt="Novel November"
              width={300}
              height={300}
              src="https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/favicon-v3.svg"
            />
          </div>
          <Column>
            <HistorySection />
            <ChallengeSection />
            <FeaturesSection />
            <GetStartedSection />
          </Column>
        </div>
      </div>
    </div>
  )
}
