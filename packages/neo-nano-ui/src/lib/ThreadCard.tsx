import Link from 'next/link'
import { ThreadSummary } from './serverFunctions/forum/getThreads'
import styles from '@/lib/styles/forum.module.css'
import { Column, Row } from './layoutElements/flexLayouts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faLock } from '@fortawesome/free-solid-svg-icons'
import { truncateText } from './misc'

export const ThreadCard = ({ thread, topicId }: { thread: ThreadSummary; topicId: string }) => {
  const { id, title, text, totalComments, isDeleted } = thread

  if (isDeleted) {
    return (
      <div style={{ fontStyle: 'italic', color: 'var(--text-colour-2)' }}>
        <FontAwesomeIcon icon={faLock} />
        This thread has been deleted by the author
        <Link style={{ paddingLeft: '10px' }} href={`/forum/${topicId}/${id}`}>
          (view history)
        </Link>
      </div>
    )
  }
  return (
    <Link href={`/forum/${topicId}/${id}`} className={styles['thread']}>
      <Row justifyContent="space-between">
        <Column>
          <h3 className={styles['forum-item-title']}>{title}</h3>
          <p style={{ paddingBottom: '12px' }}>
            {thread.authorDisplayName}: {truncateText(text)}
          </p>
        </Column>
        <div style={{ color: 'var(--primary-vibrant)', minWidth: '50px' }}>
          {totalComments} <FontAwesomeIcon icon={faComment} />
        </div>
      </Row>
    </Link>
  )
}
