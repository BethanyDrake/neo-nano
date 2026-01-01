'use client'

import { BasicButton } from '@/lib/buttons/BasicButton'
import { Column, Row } from '@/lib/layoutElements/flexLayouts'
import Link from 'next/link'
import styles from './page.module.css'
import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn'
import { useHasActiveOrUpcomingGoal } from '@/lib/hooks/useHasActiveOrUpcomingGoal'

const ActionButtons = () => {
  const {isLoggedIn, isLoading: l1} = useIsLoggedIn()
  const {hasActiveOrUpcomingGoal, isLoading: l2} = useHasActiveOrUpcomingGoal()


  if (l1|| l2) return null

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
  if(hasActiveOrUpcomingGoal)
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
  return  <Row>
        <Link href="/forum">
          <BasicButton>Browse Forum</BasicButton>
        </Link>
        <Link href="/profile">
          <BasicButton>Join The Challenge</BasicButton>
        </Link>
      </Row>
}

export const GetStartedSection = () => {

  return (
    <section>
      <h2 className={styles['section-header']} style={{ textAlign: 'center' }}>
        Get Started
      </h2>
      <ActionButtons/>
    </section>
  )
}
