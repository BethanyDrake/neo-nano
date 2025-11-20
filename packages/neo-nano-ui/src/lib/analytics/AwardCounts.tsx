'use client'
import { use } from 'react'
import { Award } from '../profile.types'
import { Column, Row } from '../layout'
import Image from 'next/image'
import styles from './awardCounts.module.css'

export const TrophyCounts = ({
  awardCountsPromise,
}: {
  awardCountsPromise: Promise<(Award & { count: number })[]>
}) => {
  const awardCounts = use(awardCountsPromise)

  return (
    <div className={styles.trophyCounts}>
      <h2>Trophies Awarded:</h2>
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
    </div>
  )
}
