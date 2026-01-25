'use client'
import { BasicButton } from '@/lib/buttons/BasicButton'
import formClasses from '@/lib/expandableForms/form.module.css'
import { Centered, Column, LeftRow, Row } from '@/lib/layoutElements/flexLayouts'
import { minutesToSeconds, secondsToMinutes, startOfToday } from 'date-fns'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useStopwatch, useTimer } from 'react-timer-hook'
import useSound from 'use-sound'
import { Goal } from '../types/forum.types'
import { useActiveTimeBasedGoal, useUpdateActiveTimeBasedGoal } from './useActiveTimeBasedGoal'
import { getDateAsString } from '../misc'
import { dateToChallengeDay } from '../serverFunctions/goals/goalUtils'
import classNames from './timer.module.css'
import { PausePlayToggle } from './PausePlayToggle'
import confetti from 'canvas-confetti'

const Timer_Initial = ({ startTimer }: { startTimer: (durationSeconds: number) => void }) => {
  const { handleSubmit, register } = useForm<{ minutes: number }>()
  return (
    <div>
      <Centered>
        <h1>Start a timer</h1>
      </Centered>
      <Row>
        <Image
          alt="clock"
          width={100}
          height={100}
          src="https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/clock.png"
        />

        <form
          className={[formClasses.form, classNames.content].join(' ')}
          onSubmit={handleSubmit(({ minutes }) => {
            startTimer(minutesToSeconds(minutes))
          })}
        >
          <Column>
            <LeftRow alignItems="baseline">
              <input type="number" id="time" placeholder="20" {...register('minutes', { required: true })} />
              <label htmlFor="time">minutes</label>
            </LeftRow>
            <BasicButton>Start</BasicButton>
          </Column>
        </form>
      </Row>
    </div>
  )
}

const getExpiryTimestamp = (seconds: number) => {
  const time = new Date()
  time.setSeconds(time.getSeconds() + seconds)
  return time
}

const Timer_InProgress = ({
  targetTime,
  onCancel,
  onFinished,
}: {
  targetTime: number
  onCancel: () => void
  onFinished: () => void
}) => {
  const { seconds, minutes, isRunning, pause, resume } = useTimer({
    expiryTimestamp: getExpiryTimestamp(targetTime),
    onExpire: onFinished,
  })

  return (
    <div>
      <Centered>
        <h1>The clock is ticking...</h1>
      </Centered>
      <LeftRow style={{flexGrow: 1}}>
        <Image
          alt="clock"
          width={100}
          height={100}
          src="https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/clock.png"
        />

        <div>
          <Column>
            <Row alignItems='center'>
              <div>{minutes}m {seconds}s</div>
              <PausePlayToggle pause={pause} resume={resume} isRunning={isRunning}/>
            </Row>
            <Row>
              <BasicButton buttonProps={{ onClick: onCancel }}>Cancel</BasicButton>
            </Row>
          </Column>
        </div>
      </LeftRow>
      </div>
  )
}

const getTodaysProgress = ({ records, startDate }: Pick<Goal, 'records' | 'startDate'>): number => {
  const today = getDateAsString(startOfToday())
  const challengeDay = dateToChallengeDay(startDate, today)
  return records[challengeDay] ?? 0
}

const formatAddMinutesText = (minutes: number) => `+${minutes} minute${minutes> 1 ? 's' : ''}`

const UpdateActiveGoal = ({
  goal,
  targetMinutes,
  extraMinutes,
  pauseTimer
}: {
  goal: Goal
  targetMinutes: number
  extraMinutes: number
  pauseTimer: () => void
}) => {
  const { addMinutes } = useUpdateActiveTimeBasedGoal(goal)

  const [hasAddedTargetMinutes, setHasAddedTargetMinutes] = useState(false)
  const [hasAddedExtraMinutes, setHasAddedExtraMinutes] = useState(false)
  const extraMinutesToAdd = hasAddedTargetMinutes ? extraMinutes : extraMinutes + targetMinutes 

  return (
    <div className={classNames.UpdateActiveGoal}>
      <Column gap="5px">
        <Centered>
          <h3>Update {goal.title}</h3>
        </Centered>
        <Centered>
          {' '}
          <div>(so far today: {getTodaysProgress(goal)} minutes)</div>
        </Centered>

        <Row>
          <BasicButton
            buttonProps={{
              onClick: () => {
                setHasAddedTargetMinutes(true)
                addMinutes(targetMinutes)
              },
              disabled: hasAddedTargetMinutes,
            }}
          >
            {formatAddMinutesText(targetMinutes)}
          </BasicButton>
          {extraMinutes > 0 && (
            <BasicButton
              buttonProps={{
                onClick: () => {
                  pauseTimer()
                  addMinutes(extraMinutesToAdd)
                  setHasAddedTargetMinutes(true)
                  setHasAddedExtraMinutes(true)
                
                },
                disabled: hasAddedExtraMinutes,
              }}
            >
              {formatAddMinutesText(extraMinutesToAdd)}
            </BasicButton>
          )}
        </Row>
      </Column>
    </div>
  )
}

export const Timer_Finished = ({
  targetTime,
  onReset,
  onRepeat,
  activeGoal,
}: {
  targetTime: number
  onReset: () => void
  onRepeat: () => void
  activeGoal?: Goal | null
}) => {
  const { seconds, minutes, pause, start, isRunning} = useStopwatch({
    autoStart: true,
  })
  useEffect(() => {
   confetti({
         disableForReducedMotion: true,
         spread: 90,
         colors: ['#C0E5C8', '#1ab394', '#6e1ab3', '#d8a9ffff'],
       })
  }, [])

  return (
    <div>
      <Centered>
        <h1>Complete!</h1>
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
              <div>+{minutes}m {seconds}s</div>
              <PausePlayToggle pause={pause} resume={start} isRunning={isRunning}/>
            </Row>

            <Row>
              <BasicButton buttonProps={{ onClick: onRepeat }}>Repeat</BasicButton>
              <BasicButton buttonProps={{ onClick: onReset }}>New target</BasicButton>
            </Row>
          </Column>
        </div>
      </Row>
      {activeGoal && (
        <UpdateActiveGoal pauseTimer={pause} goal={activeGoal} targetMinutes={secondsToMinutes(targetTime)} extraMinutes={minutes} />
      )}
    </div>
  )
}

export const Timer = () => {
  const [targetTime, setTargetTime] = useState(minutesToSeconds(20))
  const [timerState, setTimerState] = useState('initial')
  const [onCompletePlay] = useSound('https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/sounds/Success%203.wav')
  const { goal } = useActiveTimeBasedGoal()

  return (
    <div className={classNames.Timer}>
      {timerState === 'initial' && (
        <Timer_Initial
          startTimer={(durationSeconds) => {
            setTargetTime(durationSeconds)
            setTimerState('inProgress')
          }}
        />
      )}

      {timerState === 'inProgress' && (
        <Timer_InProgress
          onCancel={() => setTimerState('initial')}
          onFinished={() => {
            onCompletePlay()
            setTimerState('finished')
          }}
          targetTime={targetTime}
        />
      )}

      {timerState === 'finished' && (
        <Timer_Finished
          activeGoal={goal}
          targetTime={targetTime}
          onReset={() => setTimerState('initial')}
          onRepeat={() => setTimerState('inProgress')}
        />
      )}
    </div>
  )
}
