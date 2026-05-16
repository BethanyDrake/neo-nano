import styles from './NavBar.module.css';
import { NavBarButtons } from './NavBarButtons';
import { NavMenu } from './NavMenu';

export const NavBar = () => {
  const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
  return (
    <nav className={styles.nav} style={isPreview ? {background: 
    "repeating-conic-gradient(#108787 0 25%, #1ab394 0 50%) 50% / 10px 10px"}: {}}>
      <NavMenu/>
      <NavBarButtons />
    </nav>
  )
}
