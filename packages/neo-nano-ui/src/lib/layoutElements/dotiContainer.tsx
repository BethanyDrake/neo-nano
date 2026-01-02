import { PropsWithChildren } from "react";
import styles from './layoutElements.module.css'

export const DotiContainer =({children}: PropsWithChildren) => {
    return <div className={styles.doti}>{children}</div>
}