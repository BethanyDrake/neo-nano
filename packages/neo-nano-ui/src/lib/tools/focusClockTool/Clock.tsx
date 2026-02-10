'use client'
import { BasicButton } from '@/lib/buttons/BasicButton'
import { Centered, Column, Row } from '@/lib/layoutElements/flexLayouts'
import { secondsToMinutes, startOfToday } from 'date-fns'
import Image from 'next/image'
import { useStopwatch } from 'react-timer-hook'
import { getDateAsString, plural } from '../../misc'
import { dateToChallengeDay } from '@/lib/serverFunctions/goals/goalUtils'
import { Goal } from'@/lib/types/forum.types'
import { PausePlayToggle } from '../PausePlayToggle'
import classNames from '../timer.module.css'
import { useActiveTimeBasedGoal, useUpdateActiveTimeBasedGoal } from './useActiveTimeBasedGoal'
import { useState } from 'react'
import focusClock from './focus-clock.png'
import { track } from '@vercel/analytics';

const getTodaysProgress = ({ records, startDate }: Pick<Goal, 'records' | 'startDate'>): number => {
  const today = getDateAsString(startOfToday())
  const challengeDay = dateToChallengeDay(startDate, today)
  return records[challengeDay] ?? 0
}

const formatAddMinutesText = (minutes: number) => `+${minutes} minute${minutes === 1 ? '' : 's'}`

const UpdateActiveGoal = ({
  goal,
  totalSeconds,
}: {
  goal: Goal
  totalSeconds: number
}) => {
  const { addMinutes } = useUpdateActiveTimeBasedGoal(goal)
  const [pastAdded, setPastAdded] = useState<{id: number, timeAdded: number}[]>([])
  const [minutesAdded, setMinutesAdded] = useState(0)
  const minutesToAdd = secondsToMinutes(totalSeconds) - minutesAdded

  return (
    <div className={[classNames.UpdateActiveGoal, classNames.secondary].join(' ')}>
      <Column gap="5px">
        <Centered>
          <h3>Update {goal.title}</h3>
        </Centered>
        <Centered>
          <div>(so far today: {getTodaysProgress(goal)} minutes)</div>
        </Centered>

        <Column>
          <BasicButton
            buttonProps={{
              onClick: () => {
                addMinutes(minutesToAdd)
                track('UpdateActiveGoal',  {minutesAdded: minutesToAdd, location: 'clockTool'})
                setPastAdded([...pastAdded, {id: pastAdded.length, timeAdded: minutesToAdd}])
                setMinutesAdded(minutesAdded + minutesToAdd)
 
              },
              disabled: minutesToAdd<1
            }}
          >
            {formatAddMinutesText(minutesToAdd)}
          </BasicButton>
          {pastAdded.map(({id, timeAdded}) => (<div key={id}>Added {timeAdded} {plural('minute' , timeAdded)}</div>))}
        </Column>
      </Column>
    </div>
  )
}

const formatTimeString = ({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }): string => {
  const hours_s = `${hours}h`
  return `${hours > 0 ? hours_s : ''} ${minutes}m ${seconds}s`
}



export const Clock = () => {
  const { goal:activeGoal } = useActiveTimeBasedGoal()
   const { seconds, minutes, hours, pause, start, isRunning, reset, totalSeconds } = useStopwatch({
    autoStart: true,
  })
  
  return (
    <Centered>
      <div className={classNames.Timer}>
      <Centered>
        <h1>Focus Clock</h1>
      </Centered>
      <Row>
        <Image
          alt="clock"
          width={100}
          height={100}
          src={focusClock}
        />

        <div>
          <Column>
            <Row alignItems="baseline">
              <div>{formatTimeString({ hours, minutes, seconds })}</div>
              <PausePlayToggle pause={pause} resume={start} isRunning={isRunning} />
            </Row>

            <Row>
              <BasicButton buttonProps={{ onClick: () => reset() }}>Restart</BasicButton>
            </Row>
          </Column>
        </div>
      </Row>
      {activeGoal && (
        <UpdateActiveGoal goal={activeGoal} totalSeconds={totalSeconds}></UpdateActiveGoal>
      )}
      </div>
    </Centered>
  )
}
