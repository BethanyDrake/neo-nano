"use client"

import { faComment, faPerson } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { QuickUpdateModal } from '../goalTracker/quickUpdate/QuickUpdateModal';
import { Row } from '../layoutElements/flexLayouts';
import styles from './NavBar.module.css';
import { NewAwardModal, NewAwardModalProvider } from '../awards/NewAwardModal';

export const LoggedInNavBarButtons = () => {
    return (
    <Row>
      <Link prefetch={false}  style={{color: 'white', textShadow: "0px 0px 3px var(--off-black)",  alignSelf: 'center'}} href="/auth/logout">
        Log out
      </Link>
      <Link href="/forum">
        <button className={styles.responsiveButton}><FontAwesomeIcon icon={faComment}/>Browse Forum</button>
      </Link>
       <Link href="/profile">
        <button className={styles.responsiveButton}><FontAwesomeIcon icon={faPerson}/>My Profile</button>
      </Link>
      <NewAwardModalProvider>
        <QuickUpdateModal/>
        <NewAwardModal />
        </NewAwardModalProvider>
      </Row>)
}