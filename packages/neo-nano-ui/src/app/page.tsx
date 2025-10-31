import { auth0 } from '@/lib/auth0'
import { BasicButton } from '@/lib/buttons/BasicButton'
import { ChallengeCountDown } from '@/lib/ChallengeCountDown'
import { ClientSideOnly } from '@/lib/ClientSideOnly'
import { Column, Row } from '@/lib/layout'
import Link from 'next/link'
import { JSX } from 'react'
import styles from './page.module.css'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faChartLine, faComment, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
const Section = ({ title, body }: { title: string; body: string | JSX.Element }) => {
  return (
    <section>
      <h2 className={styles['section-header']}>{title}</h2>
      {body}
    </section>
  )
}

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
  return <Section title={title} body={body} />
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
  return <Section title={title} body={body} />
}

const HistorySection = () => {
  const title = 'History'
  const body =
    "Previously, 'National Novel Writing Month' (NaNoWriMo) was a world-wide writing challenge run by a non-profit organisation. The official website and forums shut down in March 2025, but the challenge lives on."
  return <Section title={title} body={<p>{body}</p>} />
}

const ContibutionSection = () => {
  const title = 'How to Contribute'

  return (
    <Section
      title={title}
      body={
        <>
          <p>
            This website is open source, and open to community contributions. For programmers wanting to pitch in,
            please head over to <Link href="https://github.com/BethanyDrake/neo-nano">github</Link> and check out the
            readme for further details. For everyone else, take a look at the{' '}
            <Link href="https://github.com/BethanyDrake/neo-nano/issues">issues tab</Link> to see upcoming features,
            make formal bug reports, and discuss future development. Not every suggestion will be implemented, but all
            discussion is valued and helps to make this project the best version of itself.
          </p>
        </>
      }
    />
  )
}

export default async function Home() {
  const session = await auth0.getSession()
  const isLoggedIn = !!session

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
          <Column gap="3em">
            <HistorySection />
            <ChallengeSection />
            <FeaturesSection />

            <ContibutionSection />

            <section>
              <h2 className={styles['section-header']} style={{ textAlign: 'center' }}>
                Get Started
              </h2>

              {isLoggedIn ? (
                <Row>
                  <Link href="/forum">
                    <BasicButton>Browse Forum</BasicButton>
                  </Link>
                  <Link href="/profile">
                    <BasicButton>Update Progress</BasicButton>
                  </Link>
                </Row>
              ) : (
                <Column>
                  <Row>
                    <Link href="/auth/login?screen_hint=signup">
                      <BasicButton>Sign up</BasicButton>
                    </Link>
                    <Link href="/auth/login">
                      <BasicButton>Log in</BasicButton>
                    </Link>
                  </Row>
                  <Row>
                    <Link className={styles['text-link']} href="/forum">
                      Browse forums as guest
                    </Link>
                  </Row>
                </Column>
              )}
            </section>
          </Column>
        </div>
      </div>
    </div>
  )
}
