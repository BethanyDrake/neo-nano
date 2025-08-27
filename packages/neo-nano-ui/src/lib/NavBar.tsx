import styles from './NavBar.module.css'

export const NavBar = () => {
    return(
     <nav className={styles.nav}><div className={styles['nav-header']}>NaNoWriMo - Resurrected</div>
      <div className={styles['button-container']}>
      <a href="/auth/login?screen_hint=signup">
          <button>Sign up</button>
        </a>
        <a href="/auth/login">
          <button>Log in</button></a></div></nav>)
}