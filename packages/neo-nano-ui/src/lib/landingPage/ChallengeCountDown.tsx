'use client'
import { intervalToDuration, isBefore, parseISO } from 'date-fns'

export const ChallengeCountDown = () => {
  const now = Date.now()
  const novemberFirst = parseISO('2025-11-01')

  const duration = intervalToDuration({
    start: now,
    end: novemberFirst,
  })

  if (isBefore(now, novemberFirst)) {
    return (
      <div style={{ fontStyle: 'italic' }}>
        {duration.days ?? 0} days, {duration.hours ?? 0} hours until the challenge begins.
      </div>
    )
  } else {
    return <div style={{ fontStyle: 'italic' }}>The challenge has begun!</div>
  }
}
