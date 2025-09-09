import Link from 'next/link'
import styles from './NavBar.module.css'
import { ClientSideOnly } from './ClientSideOnly'
import { BasicButton } from './buttons/BasicButton';
import { Row } from './layout';

const NavBarButtons = ({ isLoggedIn, isLoading }: { isLoggedIn: boolean; isLoading: boolean }) => {
  if (isLoading) return null
  if (isLoggedIn)
    return (
  <Row>
      <Link style={{color: 'white', alignSelf: 'center'}}href="/auth/logout">
        Log out
      </Link>
      <Link href="/forum">
        <BasicButton>Browse Forum</BasicButton>
      </Link>
       <Link href="/profile">
        <BasicButton>Update Progess</BasicButton>
      </Link>
      </Row>
    )

  return (
     <Row>
      <Link href="/auth/login?screen_hint=signup">
        <BasicButton>Sign up</BasicButton>
      </Link>
      <Link href="/auth/login">
        <BasicButton>Log in</BasicButton>
      </Link>
    </Row>
  )
}

export const NavBar = ({ isLoggedIn, isLoading }: { isLoggedIn: boolean; isLoading: boolean }) => {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles['nav-header']}>
        Home
      </Link>

      <ClientSideOnly>
        <NavBarButtons isLoggedIn={isLoggedIn} isLoading={isLoading} />
      </ClientSideOnly>
    </nav>
  )
}
