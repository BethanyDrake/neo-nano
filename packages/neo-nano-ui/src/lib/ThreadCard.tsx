import Link from 'next/link'
import { ThreadSummary } from './serverFunctions/forum/getThreads'
import styles from '@/lib/styles/forum.module.css'
import { Column, Row } from './layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

export const ThreadCard = ({ thread, topicId }: { thread: ThreadSummary; topicId: string }) => {
  const { id, title, text, totalComments } = thread
  return (
    <Link href={`/forum/${topicId}/${thread.id}`} className={styles['thread']} key={id}>
        <Row justifyContent='space-between'>
        <Column>
      <h3 className={styles['forum-item-title']}>{title}</h3>
      <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingBottom: '12px' }}>
        {text}
      </p>
      </Column>
      <div style={{color:'var(--primary-vibrant)'}}>{totalComments} <FontAwesomeIcon icon={faComment}/></div>
      </Row>
    </Link>
  )
}
