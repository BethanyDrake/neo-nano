'use client'
import { faScissors } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { startOfDay, intervalToDuration, parseISO, formatDuration, Duration, format } from 'date-fns'
import { Column } from '../layoutElements/flexLayouts'
import { Challenge, getCurrentChallenge, getPreviousChallenge, getUpcomingChallenge } from '../challenges'
import { getChallengeEndDate } from '../serverFunctions/goals/goalUtils'

const formatTimeLeft = (timeLeft: Duration) =>
  formatDuration(timeLeft, { format: ['months', 'days', 'hours'], delimiter: ', ' })

const PreviousChallengeWrapup = ({ title }: Pick<Challenge, 'title'>) => {
  return (
    <p style={{ fontStyle: 'italic' }}>
      {title} is over, the challenge is complete! Time to bask in your success and take a breather.
    </p>
  )
}

const CurrentChallengeInfo = ({ challenge }: { challenge: Challenge }) => {
  const now = Date.now()
  const timeLeft = intervalToDuration({
    start: now,
    end: getChallengeEndDate(challenge.startDate, challenge.lengthDays),
  })
  return <div style={{ fontStyle: 'italic' }}>{formatTimeLeft(timeLeft)} remaining</div>
}

export const NextChallengeAnnouncement = ({ challenge }: { challenge: Challenge }) => {
  const { title, startDate, lengthDays } = challenge
  const nextChallengeStart = startOfDay(parseISO(challenge.startDate))
  const now = Date.now()

  const timeLeft = intervalToDuration({
    start: now,
    end: nextChallengeStart,
  })
  return (
    <>
      <div>
        <p>Join us in January and Febuary for...</p>
        <p style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 'x-large' }}>
          <FontAwesomeIcon icon={faScissors} />
          {title}
          <FontAwesomeIcon icon={faScissors} flip="horizontal" />
        </p>
        <p>{'Commit to spending 80 hours (4,800 minutes) revising your novel.'}</p>

        <p>
          <span style={{ fontWeight: 'bold' }}>Start date: </span>
          <span>{format(nextChallengeStart, 'MMMM do')}</span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold' }}>End date: </span>
          <span>{format(getChallengeEndDate(startDate, lengthDays), 'MMMM do')}</span>
        </p>
      </div>
      <div style={{ fontStyle: 'italic' }}>{formatTimeLeft(timeLeft)} until the challenge begins.</div>
    </>
  )
}

export const ChallengeCountDown = () => {
  const previousChallenge = getPreviousChallenge()
  const currentChallenge = getCurrentChallenge()
  const nextChallenge = getUpcomingChallenge()
  if (currentChallenge) {
    return <CurrentChallengeInfo challenge={currentChallenge} />
  }

  return (
    <Column>
      {previousChallenge && <PreviousChallengeWrapup title={previousChallenge.title} />}

      {nextChallenge && <NextChallengeAnnouncement challenge={nextChallenge} />}
    </Column>
  )
}
