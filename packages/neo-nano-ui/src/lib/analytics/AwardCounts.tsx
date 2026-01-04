'use client'
import { Award } from '@/lib/types/profile.types'
import { Column, Row } from '../layoutElements/flexLayouts'
import Image from 'next/image'
import styles from './awardCounts.module.css'

export const TrophyCounts = ({
  awardCounts,
}: {
  awardCounts: (Award & { count: number })[]
}) => {

  return (
      <Column>
        {awardCounts.map(({ imageUrl, title, description, count, id }) => (
          <div key={id}>
            <Row justifyContent='space-between'>
            <Row>
              <Image src={imageUrl} alt={title} width={100} height={100} />
              <Column gap="5px">
                <h3 className={styles.trophyTitle}>{title}</h3>
                <p className={styles.trophyDescription}>{description}</p>
              </Column>
            </Row>
              <span style={{ fontSize: '48px', fontWeight: 'bolder', color: 'var(--primary-vibrant' }}>x{count}</span>
            </Row>
          </div>
        ))}
      </Column>
  )
}
