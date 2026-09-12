'use client'
import {  usePreviouslySeenTopicThreads } from './previouslySeenComments'
import { Column, Row } from '../layoutElements/flexLayouts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '@/lib/styles/forum.module.css'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import * as Icons from '@fortawesome/free-solid-svg-icons'

export const TopicCard = ({
  topicId,
  title,
  icon,
  description,
  totalComments,
  totalThreads,
}: {
  topicId: string
  title: string
  icon: IconProp
  description: string
  totalThreads: number
  totalComments: number
}) => {

  const previouslySeenThreads = usePreviouslySeenTopicThreads(topicId)
  const hasNewThreads = totalThreads > previouslySeenThreads

  console.log({previouslySeenThreads, hasNewThreads})
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
        <div style={{ display: 'flex', minWidth: '50px', flexDirection: 'column', gap: '1em' }}>
          <div style={{ color: hasNewThreads ? 'var(--primary-vibrant)' : 'var(--grey-dark)' }}>
            {totalThreads} <FontAwesomeIcon icon={Icons.faWorm} />
          </div>
          <div className={styles['forum-sub-title']}>
            {totalComments} <FontAwesomeIcon icon={Icons.faComment} />
          </div>
        </div>
      </Row>
    </div>
  )
}
