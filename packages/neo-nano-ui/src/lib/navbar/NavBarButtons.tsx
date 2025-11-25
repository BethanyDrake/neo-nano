'use client'
import { useUser } from "@auth0/nextjs-auth0";
import Link from 'next/link';
import { LoggedInNavBarButtons } from "./LoggedInNavBarButtons";
import { Row } from "../layoutElements/flexLayouts";
import { BasicButton } from "../buttons/BasicButton";

export const NavBarButtons = () => {
  const {isLoading, user} = useUser()
  const isLoggedIn = !!user
  if (isLoading) return null

  if (isLoggedIn)
    return (
  <LoggedInNavBarButtons/>
    )

  return (
     <Row style={{maxWidth: '100%', paddingRight: '8px'}}>
      <Link prefetch={false}  href="/auth/login?screen_hint=signup">
        <BasicButton variant='glow'>Sign up</BasicButton>
      </Link>
      <Link  prefetch={false} href="/auth/login">
        <BasicButton variant='glow'>Log in</BasicButton>
      </Link>
    </Row>
  )
}
