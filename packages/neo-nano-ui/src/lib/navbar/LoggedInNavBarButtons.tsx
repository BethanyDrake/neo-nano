"use client"

import { faComment, faPerson } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { QuickUpdateModal } from '../goalTracker/quickUpdate/QuickUpdateModal';
import { Row } from '../layout';
import styles from './NavBar.module.css';
import { ActiveGoalProvider } from '../goalTracker/quickUpdate/ActiveGoalContext';
import { NewAwardModal, NewAwardModalProvider } from '../awards/NewAwardModal';

export const LoggedInNavBarButtons = () => {
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
      <NewAwardModalProvider>
      <ActiveGoalProvider>
        <QuickUpdateModal/>
        <NewAwardModal />
        </ActiveGoalProvider>
        </NewAwardModalProvider>
      </Row>)
}