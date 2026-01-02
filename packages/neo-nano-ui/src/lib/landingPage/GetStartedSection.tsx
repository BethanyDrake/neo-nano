'use client'

import { BasicButton } from '@/lib/buttons/BasicButton'
import { Column, Row } from '@/lib/layoutElements/flexLayouts'
import Link from 'next/link'
import styles from './page.module.css'
import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn'
import { useHasActiveOrUpcomingGoal } from '@/lib/hooks/useHasActiveOrUpcomingGoal'
import { getCurrentChallenge, getUpcomingChallenge } from '../challenges'
import { joinChallenge } from '@/lib/serverFunctions/goals/joinCurrentChallenge'
import { useLoadableOnClick } from '../buttons/usLoadableOnClick'
import { useRouter } from 'next/navigation'
import { DotiContainer } from '../layoutElements/dotiContainer'

const getChallengeToJoin = () => {
  const currentChallenge = getCurrentChallenge()
  return currentChallenge || getUpcomingChallenge()
}

const JoinChallengeButton = () => {
  const router = useRouter()
  const challengeToJoin = getChallengeToJoin()

  const { onClick, isLoading } = useLoadableOnClick(() => {
    if (!challengeToJoin) throw Error()
    return joinChallenge(challengeToJoin.id).then(() => {
      router.push('/profile')
    })
  })
  return (
    <BasicButton buttonProps={{ onClick }} isLoading={isLoading}>
      Join {challengeToJoin?.title}
    </BasicButton>
  )
}

const ActionButtons = () => {
  const { isLoggedIn, isLoading: l1 } = useIsLoggedIn()
  const { hasActiveOrUpcomingGoal, isLoading: l2 } = useHasActiveOrUpcomingGoal()

  if (l1 || l2) return null

  if (!isLoggedIn) {
    return (
      <Column>
        <Row>
          <Link prefetch={false} href="/auth/login?screen_hint=signup">
            <BasicButton>Sign up</BasicButton>
          </Link>
          <Link prefetch={false} href="/auth/login">
            <BasicButton>Log in</BasicButton>
          </Link>
        </Row>
        <Row>
          <Link className={styles['text-link']} href="/forum">
            Browse forums as guest
          </Link>
        </Row>
      </Column>
    )
  }
  if (hasActiveOrUpcomingGoal)
    return (
      <Row>
        <Link href="/forum">
          <BasicButton>Browse Forum</BasicButton>
        </Link>
        <Link href="/profile">
          <BasicButton>Update Progress</BasicButton>
        </Link>
      </Row>
    )
  return (
    <Column alignItems="center">
      <JoinChallengeButton />
      or
      <Link href="/forum">
        <BasicButton>Browse Forum</BasicButton>
      </Link>
    </Column>
  )
}

export const GetStartedSection = () => {
  const { hasActiveOrUpcomingGoal } = useHasActiveOrUpcomingGoal()

  return (
    <DotiContainer>
    <section>
      <Column gap="16px">
        <h2 className={styles['section-header']} style={{ textAlign: 'center' }}>
          {hasActiveOrUpcomingGoal ? 'Welcome back!' : 'Get Started'}
        </h2>
        <ActionButtons />
      </Column>
    </section>
    </DotiContainer>
  )
}
