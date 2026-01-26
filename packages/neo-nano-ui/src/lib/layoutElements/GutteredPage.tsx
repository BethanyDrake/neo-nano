import { PropsWithChildren } from 'react'
import styles from './GutteredPage.module.css'
import Image from 'next/image'
import imageSrc from "./paper-background.png";
const Background = () => {
  return (
    <div style={{ position: 'fixed', width: '100vw' , height: '100vh', backgroundColor: "var(--primary-dark)" }}>
      <Image
        style={{ zIndex: 1 }}
        alt=""
        placeholder='blur'
        src={imageSrc}
      />
    </div>
  )
}

export const GutteredPage = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.background}>
      <Background />

      <main className={styles.main}>
        <div>{children}</div>
      </main>
    </div>
  )
}
