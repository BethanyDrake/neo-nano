import { PropsWithChildren } from 'react'
import styles from './GutteredPage.module.css'

export const GutteredPage = ({children}: PropsWithChildren) => {
  return ( <div
      className={styles.background}
      style={{
        backgroundImage: 'url(https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/bookcase-small.jpg)',
        backgroundSize: '1000px',
      }}
    > <div className={styles.main}>
        <div style={{ maxWidth: '100vw', padding: '16px' }}>
      {children}
        </div>
      </div></div>)
}