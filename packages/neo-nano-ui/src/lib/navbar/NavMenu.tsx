'use client'
import styles from './NavBar.module.css'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faChartColumn, faComment, faHammer, faPerson, faQuestion } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { ModeratorOnly } from '../moderation/ModeratorOnly'
import { Row } from '../layoutElements/flexLayouts'
import { PropsWithChildren } from 'react'
const MyMenuItem = ({ close, href, children }: PropsWithChildren & { close: () => void; href: string }) => {
  return (
    <MenuItem as="div" className={styles['menu-item']}>
      <Link href={href} onClick={close}>
        {children}
      </Link>
    </MenuItem>
  )
}

export const NavMenu = () => {
  return (
    <Menu>
      {({ close }) => {
        return (
          <>
            <MenuButton title={'open navigation menu'} className={styles['nav-bar-button']}>
              <FontAwesomeIcon color="white" icon={faBars} />
            </MenuButton>
            <MenuItems anchor="bottom" className={styles['menu-items']}>
              <MyMenuItem href="/" close={close}>
                Home
              </MyMenuItem>
              <MyMenuItem href="/forum" close={close}>
                <Row justifyContent="space-between">
                  <span>Forum</span> <FontAwesomeIcon icon={faComment} />
                </Row>
              </MyMenuItem>
              <MyMenuItem href="/profile" close={close}>
                <Row justifyContent="space-between">
                  <span>My Profile</span> <FontAwesomeIcon icon={faPerson} />
                </Row>
              </MyMenuItem>
              <MyMenuItem href="/analytics" close={close}>
                <Row justifyContent="space-between">
                  <span>Analytics</span> <FontAwesomeIcon icon={faChartColumn} />
                </Row>
              </MyMenuItem>

              <MyMenuItem href="/moderation/code-of-conduct" close={close}>
                Code of Conduct
              </MyMenuItem>

              <MyMenuItem href="/about" close={close}>
                <Row justifyContent="space-between">
                  <span>About</span> <FontAwesomeIcon icon={faQuestion} />
                </Row>
              </MyMenuItem>

              <MyMenuItem href="/tools" close={close}>
                <Row justifyContent="space-between">
                  <span>Tools</span> <FontAwesomeIcon icon={faHammer} />
                </Row>
              </MyMenuItem>

              <ModeratorOnly>
                <MyMenuItem href="/moderation" close={close}>
                  Moderation
                </MyMenuItem>
              </ModeratorOnly>
            </MenuItems>
          </>
        )
      }}
    </Menu>
  )
}
