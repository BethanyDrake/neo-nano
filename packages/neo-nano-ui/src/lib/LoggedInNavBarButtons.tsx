"use client"

import { faComment, faPerson } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { QuickUpdateModal } from './goalTracker/quickUpdate/QuickUpdateModal';
import { Row } from './layout';
import styles from './NavBar.module.css';
import { ActiveGoalProvider } from './goalTracker/quickUpdate/ActiveGoalContext';


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
      <ActiveGoalProvider>
        <QuickUpdateModal/>
        </ActiveGoalProvider>
      </Row>)
}