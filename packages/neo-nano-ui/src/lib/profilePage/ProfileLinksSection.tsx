import Image from 'next/image'
import Link from 'next/link'
import wattpadLogo from '@/lib/media/thirdPartyLogos/wattpad.svg'
import substackLogo from '@/lib/media/thirdPartyLogos/substack.svg'
import ao3Logo from '@/lib/media/thirdPartyLogos/ao3.svg'
import blueskyLogo from '@/lib/media/thirdPartyLogos/bluesky.svg'
import { Profile } from '../types/forum.types'
import styles from './profilePage.module.css'

export const ProfileLinks = ({links}: { links: Profile['links']}) => {
  if (Object.values(links).every((link) => !link)) {
    return null
  }
  return (
    <>
    <h3>Follow my writing:</h3>
    <ul className={styles.List}>
      {links.wattpad && (<li>
        <Link href={`https://www.wattpad.com/user/${links.wattpad}`}>
          <Image className={styles.Icon} height={20} alt={'wattpad'} src={wattpadLogo} />{links.wattpad}
        </Link>
      </li>)}
       {links.substack && (<li>
        <Link href={`https://substack.com/${links.substack}`}>
          <Image className={styles.Icon} height={20} alt={'substack'} src={substackLogo} />{links.substack}
        </Link>
      </li>)}
      {links.ao3 && (<li>
        <Link href={`https://archiveofourown.org/users/${links.ao3}`}>
          <Image className={styles.Icon} height={20} alt={'archive of our own'} src={ao3Logo} />{links.ao3}
        </Link>
      </li>)}
      {links.bluesky && (<li>
        <Link href={`https://bsky.app/profile/${links.bluesky?.slice(1)}.bsky.social`}>
          <Image className={styles.Icon} height={20} alt={'bluesky'} src={blueskyLogo} />{links.bluesky}
        </Link>
      </li>)}
    </ul></>
  )
}
