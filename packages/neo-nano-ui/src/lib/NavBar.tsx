import { faComment, faPerson } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { BasicButton } from './buttons/BasicButton';
import { ClientSideOnly } from './ClientSideOnly';
import { Row } from './layout';
import { QuickUpdateModal } from './goalTracker/quickUpdate/QuickUpdateModal';
import styles from './NavBar.module.css';
import { NavMenu } from './NavMenu';

const NavBarButtons = ({ isLoggedIn, isLoading }: { isLoggedIn: boolean; isLoading: boolean }) => {
  if (isLoading) return null

  if (isLoggedIn)
    return (
  <Row>
      <Link prefetch={false}  style={{color: 'white', alignSelf: 'center'}} href="/auth/logout">
        Log out
      </Link>
      <Link href="/forum">
        <button className={styles.responsiveButton}><FontAwesomeIcon icon={faComment}/>Browse Forum</button>
      </Link>
       <Link href="/profile">
        <button className={styles.responsiveButton}><FontAwesomeIcon icon={faPerson}/>My Profile</button>
      </Link>
        <QuickUpdateModal/>
        
      </Row>
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
