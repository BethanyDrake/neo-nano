import {  PropsWithChildren } from 'react'
import styles from './layoutElements.module.css'

export const Section = ({ title, children }: { title: string; } & PropsWithChildren) => {
  return (
    <section>
      <h2 className={styles['section-header']}>{title}</h2>
      {children}
    </section>
  )
}
