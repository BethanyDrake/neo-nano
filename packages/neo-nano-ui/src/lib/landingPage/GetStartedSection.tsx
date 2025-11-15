'use client'

import { BasicButton } from '@/lib/buttons/BasicButton'
import { Column, Row } from '@/lib/layout'
import Link from 'next/link'
import styles from './page.module.css'
import { useUser } from '@auth0/nextjs-auth0'
const ActionButtons = () => {
  const {user, isLoading} = useUser()


  if (isLoading) return null
  if (user)
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
  )
}

export const GetStartedSection = () => {
  return (
    <section>
      <h2 className={styles['section-header']} style={{ textAlign: 'center' }}>
        Get Started
      </h2>

      <ActionButtons />
    </section>
  )
}
