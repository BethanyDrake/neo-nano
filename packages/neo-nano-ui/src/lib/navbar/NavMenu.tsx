import styles from './NavBar.module.css'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faChartColumn, faComment, faHammer, faPerson, faQuestion } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { ModeratorOnly } from '../moderation/ModeratorOnly'
import { Row } from '../layoutElements/flexLayouts'

export const NavMenu = () => {
  return (
    <Menu>
      <MenuButton title={'open navigation menu'} className={styles['nav-bar-button']}>
        <FontAwesomeIcon color="white" icon={faBars} />
      </MenuButton>
      <MenuItems anchor="bottom" className={styles['menu-items']}>
        <MenuItem>
          <Link className={styles['menu-item']} href="/">
            Home
          </Link>
        </MenuItem>
        <MenuItem>
          <Link className={styles['menu-item']} href="/forum">
            <Row justifyContent="space-between">
              <span>Forum</span> <FontAwesomeIcon icon={faComment} />
            </Row>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link className={styles['menu-item']} href="/profile">
            <Row justifyContent="space-between">
              <span>My Profile</span> <FontAwesomeIcon icon={faPerson} />
            </Row>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link className={styles['menu-item']} href="/analytics">
            <Row justifyContent="space-between">
              <span>Analytics</span> <FontAwesomeIcon icon={faChartColumn} />
            </Row>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link className={styles['menu-item']} href="/moderation/code-of-conduct">
            Code of Conduct
          </Link>
        </MenuItem>
        <MenuItem>
          <Link className={styles['menu-item']} href="/about">
        <Row justifyContent="space-between">
              <span>About</span> <FontAwesomeIcon icon={faQuestion} />
            </Row>
          </Link>
        </MenuItem>
         <MenuItem>
          <Link className={styles['menu-item']} href="/tools">
             <Row justifyContent="space-between">
              <span>Tools</span> <FontAwesomeIcon icon={faHammer} />
            </Row>
          </Link>
        </MenuItem>
        <ModeratorOnly>
          <MenuItem>
            <Link className={styles['menu-item']} href="/moderation">
              Moderation
            </Link>
          </MenuItem>
        </ModeratorOnly>
      </MenuItems>
    </Menu>
  )
}
