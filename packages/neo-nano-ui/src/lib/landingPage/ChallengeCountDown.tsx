'use client'
import { faScissors } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { endOfDay, startOfDay, intervalToDuration, isBefore, parseISO, formatDuration, Duration } from 'date-fns'
import { Column } from '../layoutElements/flexLayouts'

const currentChallengeEndDate = '2025-11-30'
const nextChallengeStartDate = '2026-01-01'

const formatTimeLeft = (timeLeft: Duration) =>
  formatDuration(timeLeft, { format: ['months', 'days', 'hours'], delimiter: ', ' })

export const ChallengeCountDown = () => {
  const now = Date.now()
  const challengeEnd = endOfDay(parseISO(currentChallengeEndDate))
  const nextChallengeStart = startOfDay(parseISO(nextChallengeStartDate))

  if (isBefore(now, challengeEnd)) {
    const timeLeft = intervalToDuration({
      start: now,
      end: challengeEnd,
    })
    return <div style={{ fontStyle: 'italic' }}>{formatTimeLeft(timeLeft)} hours remaining</div>
  }
  if (isBefore(now, nextChallengeStart)) {
    const timeLeft = intervalToDuration({
      start: now,
      end: nextChallengeStart,
    })
    return (
      <Column>
        <p style={{ fontStyle: 'italic' }}>
          November is over, the challenge is complete! Time to bask in your success and take a breather.
        </p>

        <div>
          <p>Join us in January and Febuary for...</p>
          <p style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 'x-large' }}>
            <FontAwesomeIcon icon={faScissors} />
            The Eighty Hour Edit
            <FontAwesomeIcon icon={faScissors} flip="horizontal" />
          </p>
          <p>{'Commit to spending 80 hours (4,800 minutes) revising your novel.'}</p>

          <p>
            <span style={{ fontWeight: 'bold' }}>Start date: </span>
            <span>January 1st</span>
          </p>
          <p>
            <span style={{ fontWeight: 'bold' }}>End date: </span>
            <span>Febuary 28th</span>
          </p>
        </div>
        <div style={{ fontStyle: 'italic' }}>{formatTimeLeft(timeLeft)} until the challenge begins.</div>
      </Column>
    )
  }

  return null
}
