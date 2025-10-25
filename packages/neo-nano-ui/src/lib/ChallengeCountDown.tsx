'use client'
import { intervalToDuration, isBefore } from 'date-fns'

export const ChallengeCountDown = () => {
  const today = new Date()
  const novemberFirst = new Date('2025-11-01')

  const duration = intervalToDuration({
    start: today,
    end: novemberFirst,
  })

  if (isBefore(today, novemberFirst)) {
    return (
      <div style={{ fontStyle: 'italic' }}>
        {duration.days} days, {duration.hours} hours until the challenge begins.
      </div>
    )
  } else {
    return <div style={{ fontStyle: 'italic' }}>The challenge has begun!</div>
  }
}
