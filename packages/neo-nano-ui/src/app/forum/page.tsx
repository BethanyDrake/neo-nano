import { Column, LeftRow, Row } from '@/lib/layout'
import styles from '@/lib/styles/forum.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { getForumTopics } from '@/lib/serverFunctions/forum/getForumTopics'
import Link from 'next/link'

const QuickLink = ({title, icon, href}: {title: string, icon: IconProp, href:string}) => {
  return (

    <div  className={styles['forum-item']}>
    <Link href={href} style={{color: 'inherit', textDecoration: 'none'}}>
        <LeftRow>
        <Column>
          <div className={styles['forum-icon']}>
            <FontAwesomeIcon icon={icon} />
          </div>
        </Column>
        <Column>
          <h3 className={styles['forum-item-title']} style={{textDecoration: 'none'}}>
            {title}
          </h3>
        </Column>
        </LeftRow>
    </Link>
    </div>
  )
}

const TopicCard = ({
  topicId,
  title,
  icon,
  description,
  totalComments,
  totalThreads
}: {
  topicId: string
  title: string
  icon: IconProp
  description: string
  totalThreads: number
  totalComments: number
}) => {
  return (

    <div className={styles['forum-item']}>
      <Row justifyContent="space-between">
        <Row>
        <Column>
          <div className={styles['forum-icon']}>
            <FontAwesomeIcon icon={icon} />
          </div>
        </Column>
        <Column>
          <a href={`forum/${topicId}`} className={styles['forum-item-title']}>
            {title}
          </a>
          <div className={styles['forum-sub-title']}>{description}</div>
        </Column>
        </Row>
        <div style={{display:'flex', minWidth:'50px', flexDirection:'column', gap:'1em'}}>
        <div style={{color:'var(--primary-vibrant)'}}>{totalThreads} <FontAwesomeIcon icon={Icons.faWorm}/></div>
        <div className={styles['forum-sub-title']}>{totalComments} <FontAwesomeIcon icon={Icons.faComment}/></div>
        </div>
      </Row>
    </div>
  )
}

const Forum = async () => {
  const categories = await getForumTopics()
 
  return (
    <div className={styles['forum-container']}>
       <h2>Quick Links</h2>
      <QuickLink title={'Recent activity'} icon={Icons.faClock} href={'forum/recent'} />
      <QuickLink title={'My Threads'} icon={Icons.faUser} href={'forum/my-threads'}/>
      {categories.map(({ id, title, topics }) => {
        return (
          <div key={id}>
            <h2>{title}</h2>
            {topics?.map(({ id, title, description, icon, total_threads, total_comments }) => {
              return <TopicCard 
                key={id} 
                topicId={id} 
                title={title} 
                description={description} 
                icon={Icons[icon]} 
                totalThreads={total_threads}
                totalComments={total_comments} />
            })}
          </div>
        )
      })}
    </div>
  )
}

export default Forum
