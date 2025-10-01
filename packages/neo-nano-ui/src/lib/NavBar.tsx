import Link from 'next/link'
import styles from './NavBar.module.css'
import { ClientSideOnly } from './ClientSideOnly'
import { BasicButton } from './buttons/BasicButton';
import { Row } from './layout';
import { NavMenu } from './NavMenu';

const NavBarButtons = ({ isLoggedIn, isLoading }: { isLoggedIn: boolean; isLoading: boolean }) => {
  if (isLoading) return null
  if (isLoggedIn)
    return (
  <Row>
      <Link style={{color: 'white', alignSelf: 'center'}} href="/auth/logout">
        Log out
      </Link>
      <Link prefetch={false} href="/forum">
        <BasicButton>Browse Forum</BasicButton>
      </Link>
       <Link href="/profile">
        <BasicButton>Update Progess</BasicButton>
      </Link>
      </Row>
    )

  return (
     <Row>
      <Link prefetch={false}  href="/auth/login?screen_hint=signup">
        <BasicButton>Sign up</BasicButton>
      </Link>
      <Link  prefetch={false} href="/auth/login">
        <BasicButton>Log in</BasicButton>
      </Link>
    </Row>
  )
}

export const NavBar = ({ isLoggedIn, isLoading, isModerator }: { isLoggedIn: boolean; isLoading: boolean, isModerator: boolean }) => {

  return (
    <nav className={styles.nav}>
      <NavMenu isModerator={isModerator}/>
      <ClientSideOnly>
        <NavBarButtons isLoggedIn={isLoggedIn} isLoading={isLoading} />
      </ClientSideOnly>
    </nav>
  )
}
