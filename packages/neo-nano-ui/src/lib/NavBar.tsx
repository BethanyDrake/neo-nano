import Link from 'next/link'
import styles from './NavBar.module.css'
import { ClientSideOnly } from './ClientSideOnly'

const NavBarButtons = ({ isLoggedIn, isLoading }: { isLoggedIn: boolean; isLoading: boolean }) => {
  if (isLoading) return null
  if (isLoggedIn)
    return (
      <a href="/auth/logout">
        <button>Log out</button>
      </a>
    )

  return (
    <div className={styles['button-container']}>
      <a href="/auth/login?screen_hint=signup">
        <button>Sign up</button>
      </a>
      <a href="/auth/login">
        <button>Log in</button>
      </a>
    </div>
  )
}

export const NavBar = ({ isLoggedIn, isLoading }: { isLoggedIn: boolean; isLoading: boolean }) => {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles['nav-header']}>
        NaNoWriMo - Resurrected
      </Link>

      <ClientSideOnly>
        <NavBarButtons isLoggedIn={isLoggedIn} isLoading={isLoading} />
      </ClientSideOnly>
    </nav>
  )
}
