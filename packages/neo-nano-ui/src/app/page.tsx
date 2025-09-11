import { auth0 } from '@/lib/auth0'
import styles from './page.module.css'
import { JSX } from 'react'
import bg from './pexels-technobulka-2908984.jpg'
import { Column, Row } from '@/lib/layout'
import Link from 'next/link'
import { BasicButton } from '@/lib/buttons/BasicButton'

const Section = ({ title, body }: { title: string; body: string | JSX.Element }) => {
  return (
    <section>
      <h2 className={styles['section-header']}>{title}</h2>
      {body}
    </section>
  )
}

const ChallengeBody = () => {
  const rules = [
    '50,000 words',
    '30 days',
    'A full, completed draft of a new novel',
    'No editting, no second guessing, no hesitation',
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
    "Previously, 'National Novel Writing Month' (NaNoWriMo) was a world-wide writing challenge run by a non-profit organisation. The official website and forumns shut down in March 2025, but the challenge lives on."
  return <Section title={title} body={<p>{body}</p>} />
}

export default async function Home() {
  const session = await auth0.getSession()
  const isLoggedIn = !!session

  return (
    <div className={styles.background} style={{ backgroundImage: `url(${bg.src})`, backgroundSize: '1000px' }}>
      <main className={styles.main}>
        <h1 className={styles.h1}>NaNoWriMo - Resurrected</h1>
        <Column gap="3em">
          <HistorySection />
          <ChallengeSection />

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
      </main>
    </div>
  )
}
