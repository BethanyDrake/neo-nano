'use client'
import { addDays, Duration, formatDuration, intervalToDuration, isPast, parseISO, startOfDay } from 'date-fns'
import { useState } from 'react'
import { Challenge, getCurrentChallenge, getPreviousChallenge, getUpcomingChallenge } from '../challenges'
import { Column } from '../layoutElements/flexLayouts'
import { getChallengeEndDate } from '../serverFunctions/goals/goalUtils'

const formatTimeLeft = (timeLeft: Duration) =>
  formatDuration(timeLeft, { format: ['months', 'days', 'hours'], delimiter: ', ' })

const PreviousChallengeWrapup = ({ challenge}: {challenge: Challenge}) => {
  const endDate = getChallengeEndDate(challenge.startDate,challenge.lengthDays)
  const isOldNews = isPast(addDays(endDate, 10))
  if (isOldNews) return null
  return (
    <p style={{ fontStyle: 'italic' }}>
      {challenge.title} is over, the challenge is complete! Time to bask in your success and take a breather.
    </p>
  )
}

const CurrentChallengeInfo = ({ challenge }: { challenge: Challenge }) => {
  const [now] = useState(() => Date.now())
  const timeLeft = intervalToDuration({
    start: now,
    end: getChallengeEndDate(challenge.startDate, challenge.lengthDays),
  })
  return  (    
      <div style={{ fontStyle: 'italic' }}>{formatTimeLeft(timeLeft)} remaining</div>
)
}

export const NextChallengeAnnouncement = ({ challenge }: { challenge: Challenge }) => {
  const { title } = challenge
  const nextChallengeStart = startOfDay(parseISO(challenge.startDate))

  const [now] = useState(() => Date.now())

  const timeLeft = intervalToDuration({
    start: now,
    end: nextChallengeStart,
  })
  return (
    <>
        {title !== "Novel November" &&<p style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 'x-large' }}>
          {title}
        </p>}
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
      {previousChallenge && <PreviousChallengeWrapup challenge={previousChallenge}/>}

      {nextChallenge && <NextChallengeAnnouncement challenge={nextChallenge} />}
    </Column>
  )
}
