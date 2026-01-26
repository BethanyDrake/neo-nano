'use client'
import { BasicButton } from '@/lib/buttons/BasicButton'
import { Centered, Column, Row } from '@/lib/layoutElements/flexLayouts'
import { startOfToday } from 'date-fns'
import Image from 'next/image'
import { useStopwatch } from 'react-timer-hook'
import { getDateAsString } from '../misc'
import { dateToChallengeDay } from '../serverFunctions/goals/goalUtils'
import { Goal } from '../types/forum.types'
import { PausePlayToggle } from './PausePlayToggle'
import classNames from './timer.module.css'
import { useActiveTimeBasedGoal, useUpdateActiveTimeBasedGoal } from './useActiveTimeBasedGoal'


const getTodaysProgress = ({ records, startDate }: Pick<Goal, 'records' | 'startDate'>): number => {
  const today = getDateAsString(startOfToday())
  const challengeDay = dateToChallengeDay(startDate, today)
  return records[challengeDay] ?? 0
}

const formatAddMinutesText = (minutes: number) => `+${minutes} minute${minutes > 1 ? 's' : ''}`

const UpdateActiveGoal = ({
  goal,
  minutes,
  onAddMinutes
}: {
  goal: Goal
  minutes: number
  onAddMinutes: () => void
}) => {
  const { addMinutes } = useUpdateActiveTimeBasedGoal(goal)

  return (
    <div className={classNames.UpdateActiveGoal}>
      <Column gap="5px">
        <Centered>
          <h3>Update {goal.title}</h3>
        </Centered>
        <Centered>
          <div>(so far today: {getTodaysProgress(goal)} minutes)</div>
        </Centered>

        <Row>
          <BasicButton
            buttonProps={{
              onClick: () => {
                addMinutes(minutes)
                onAddMinutes()
              },
              disabled: minutes<1
            }}
          >
            {formatAddMinutesText(minutes)}
          </BasicButton>
        </Row>
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
   const { seconds, minutes, hours, pause, start, isRunning, reset } = useStopwatch({
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
          src="https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/clock.png"
        />

        <div>
          <Column>
            <Row alignItems="baseline">
              <div>+{formatTimeString({ hours, minutes, seconds })}</div>
              <PausePlayToggle pause={pause} resume={start} isRunning={isRunning} />
            </Row>

            <Row>
              <BasicButton buttonProps={{ onClick: () => reset() }}>Restart</BasicButton>
            </Row>
          </Column>
        </div>
      </Row>
      {activeGoal && (
        <UpdateActiveGoal onAddMinutes={reset} goal={activeGoal} minutes={minutes}></UpdateActiveGoal>
      )}
      </div>
    </Centered>
  )
}
