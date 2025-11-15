
import styles from './NavBar.module.css'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { ModeratorOnly } from '../moderation/ModeratorOnly'

export const NavMenu = () => {
  return (
    <Menu>
      <MenuButton title={'open navigation menu'} className={styles['nav-bar-button']}><FontAwesomeIcon color="white" icon={faBars} /></MenuButton>
      <MenuItems anchor="bottom" className={styles["menu-items"]}>
      <MenuItem>
          <Link className={styles["menu-item"]} href="/">
            Home
          </Link>
        </MenuItem>
        <MenuItem>
          <Link className={styles["menu-item"]} href="/forum">
            Forum
          </Link>
        </MenuItem>
        <MenuItem>
          <Link className={styles["menu-item"]} href="/profile">
            My Profile
          </Link>
        </MenuItem>
        <MenuItem>
          <Link className={styles["menu-item"]}href="/moderation/code-of-conduct">
            Code of Conduct
          </Link>
        </MenuItem>
        <ModeratorOnly>
        <MenuItem>
          <Link className={styles["menu-item"]}href="/moderation">
            Moderation
          </Link>
        </MenuItem>
        </ModeratorOnly>
      </MenuItems>
    </Menu>
  )
}