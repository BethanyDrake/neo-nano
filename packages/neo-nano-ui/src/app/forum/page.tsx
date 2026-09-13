import { Column, LeftRow } from '@/lib/layoutElements/flexLayouts'
import styles from '@/lib/styles/forum.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { getForumTopics } from '@/lib/serverFunctions/forum/getForumTopics'
import { connection } from 'next/server'
import Link from 'next/link'
import { FullWidthPage } from '@/lib/layoutElements/FullWidthPage'
import { TopicCard } from '@/lib/forum/TopicCard'

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



const Forum = async () => {
  await connection()
  const categories = await getForumTopics()
 
  return (
    <FullWidthPage>
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
    </FullWidthPage>
  )
}

export default Forum
