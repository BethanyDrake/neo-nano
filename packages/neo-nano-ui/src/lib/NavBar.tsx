import styles from './NavBar.module.css';
import { NavBarButtons } from './navbar/NavBarButtons';
import { NavMenu } from './NavMenu';


export const NavBar = () => {

  return (
    <nav className={styles.nav}>
      <NavMenu/>
      <NavBarButtons />
    </nav>
  )
}
