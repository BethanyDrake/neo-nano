import Link from 'next/link'
import { ThreadSummary } from './serverFunctions/forum/getThreads'
import styles from '@/lib/styles/forum.module.css'
import { Column, Row } from './layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

export const truncateText = (text: string) => {
  const targetLength = 100
    if(text.length <= targetLength) {
        return text
    }
    
    return `${text.slice(0, targetLength)}...`
}

export const ThreadCard = ({ thread, topicId }: { thread: ThreadSummary; topicId: string }) => {
  const { id, title, text, totalComments } = thread
  return <Link href={`/forum/${topicId}/${id}`} className={styles['thread']}><Row justifyContent='space-between'>
        <Column>
      <h3 className={styles['forum-item-title']}>{title}</h3>
      <p style={{ paddingBottom: '12px' }}>
        {truncateText(text)}
      </p>
      </Column>
      <div style={{color:'var(--primary-vibrant)', minWidth: '50px'}}>{totalComments} <FontAwesomeIcon icon={faComment}/></div>
      </Row></Link>
}
