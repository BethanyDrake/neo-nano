import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import styles from './Breadcrumbs.module.css'

const BreadcrumbLink = ({ href, text }: { href: string; text: string | React.ReactNode}) => {
  return (
    <span>
      <Link key={`${href}-link`} className={styles.breadcrumb} href={href}>
        {text}
      </Link>
      <FontAwesomeIcon key={`${href}-chevron`} style={{ alignSelf: 'center' }} icon={faChevronRight} />
    </span>
  )
}

const BreadcrumbTitle = ({ text }: { text: string | React.ReactNode }) => {
  return <h2 className={styles.breadcrumb}>{text}</h2>
}

type BreadcrumbItem = { href?: string; text: string | React.ReactNode }

export const Breadcrumbs = ({ breadcrumbItems }: { breadcrumbItems: BreadcrumbItem[] }) => {
  return (
    <div className={styles['breadcrumb-container']}>
      {breadcrumbItems.map(({ href, text }) => {
        if (href) return <BreadcrumbLink key={href} href={href} text={text} />
        else return <BreadcrumbTitle key={'no-link'} text={text} />
      })}
    </div>
  )
}
