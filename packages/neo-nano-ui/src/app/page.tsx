import { auth0 } from '@/lib/auth0'
import styles from './page.module.css'
import { AnchorHTMLAttributes, JSX, PropsWithChildren } from 'react'
import bg from './pexels-technobulka-2908984.jpg'
import { Column, Row } from '@/lib/layout'
import Link from 'next/link'
import { NavBar } from '@/lib/NavBar'

const Section = ({ title, body }: { title: string; body: string | JSX.Element }) => {
  return (
    <section>
      <h2 className={styles['section-header']}>{title}</h2>
      {body}
    </section>
  )
}

const BigButton = ({ href, children }: PropsWithChildren & Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) => {
  return (
    <a href={href}>
      <button className={styles['button-72']}>{children}</button>
    </a>
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
  // Fetch the user session
  const session = await auth0.getSession()
  {
    console.log('Home', session)
  }
  const isLoggedIn = !!session

  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} isLoading={false} />
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
                  <BigButton href="/forum">Browse forum</BigButton>
                  <BigButton href="/profile">My Profile</BigButton>
                </Row>
              ) : (
                <Column>
                  <Row>
                    <BigButton href="/auth/login?screen_hint=signup">Sign up</BigButton>
                    <BigButton href="/auth/login">Log in</BigButton>
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
    </>
  )
}
