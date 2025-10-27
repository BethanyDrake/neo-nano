import { auth0 } from '@/lib/auth0'
import { BasicButton } from '@/lib/buttons/BasicButton'
import { ChallengeCountDown } from '@/lib/ChallengeCountDown'
import { ClientSideOnly } from '@/lib/ClientSideOnly'
import { Column, Row } from '@/lib/layout'
import Link from 'next/link'
import { JSX } from 'react'
import styles from './page.module.css'
import Image from 'next/image'
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

  return <Section 
    title={title} 
    body={<>
      <p>This website is open source, and open to community contributions. For programmers wanting to pitch in, please head over to <Link href='https://github.com/BethanyDrake/neo-nano'>github</Link> and check out the readme for further details. For everyone else, take a look at the <Link href="https://github.com/BethanyDrake/neo-nano/issues">issues tab</Link> to see upcoming features, make formal bug reports, and discuss future development. Not every suggestion will be implemented, but all discussion is valued and helps to make this project the best version of itself.</p>
      
      </>} />
}

export default async function Home() {
  const session = await auth0.getSession()
  const isLoggedIn = !!session

  return (
    <div className={styles.background} style={{ backgroundImage: 'url(https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/pexels-technobulka-2908984.jpg)', backgroundSize: '1000px' }}>
      <main className={styles.main}>
      
      <div style={{textAlign: 'center', minHeight:'75px'}}>
   
        <h1 className={styles.h1}>Novel November</h1>
        <ClientSideOnly><ChallengeCountDown/></ClientSideOnly>
           <Image alt="Novel November" width={300} height={300} src="https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/favicon-v3.svg"/>
      
        </div>
        <Column gap="3em">
          <HistorySection />
          <ChallengeSection />
          <ContibutionSection/>

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
