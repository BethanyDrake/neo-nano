'use client'
import { BasicButton } from '@/lib/buttons/BasicButton'
import formClasses from '@/lib/expandableForms/form.module.css'
import { Centered, Column, Row } from '@/lib/layoutElements/flexLayouts'
import { faTools } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { minutesToSeconds, secondsToMinutes, startOfToday } from 'date-fns'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useStopwatch, useTimer } from 'react-timer-hook'
import useSound from 'use-sound'
import { Goal } from '../types/forum.types'
import { useActiveTimeBasedGoal, useUpdateActiveTimeBasedGoal } from './useActiveTimeBasedGoal'
import { getDateAsString } from '../misc'
import { dateToChallengeDay } from '../serverFunctions/goals/goalUtils'
import classNames from './timer.module.css'

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
          className={formClasses.form}
          onSubmit={handleSubmit(({ minutes }) => {
            console.log('submit', minutes)
            startTimer(minutesToSeconds(minutes))
          })}
        >
          <Column>
            <Row alignItems="baseline">
              <input type="number" id="time" placeholder="20" {...register('minutes', { required: true })} />
              <label htmlFor="time">minutes</label>
            </Row>
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
              {minutes}m {seconds}s
            </Row>
            <Row>
              <BasicButton buttonProps={{ onClick: isRunning ? pause : resume }}>
                {isRunning ? 'Pause' : 'Continue'}
              </BasicButton>{' '}
              <BasicButton buttonProps={{ onClick: onCancel }}>Cancel</BasicButton>
            </Row>
          </Column>
        </div>
      </Row>
    </div>
  )
}

const getTodaysProgress = ({records, startDate}: Pick<Goal, 'records'| 'startDate'>): number => {
   const today = getDateAsString(startOfToday())
    const challengeDay = dateToChallengeDay(startDate, today)
   return records[challengeDay] ?? 0
}

const UpdateActiveGoal = ({goal, targetMinutes, extraMinutes}: {goal: Goal, targetMinutes: number, extraMinutes: number}) => {
  const {addMinutes} =useUpdateActiveTimeBasedGoal(goal)
  return (<div className={classNames.UpdateActiveGoal}>
    <Column gap="5px">
<Centered><h3>Update {goal.title}</h3></Centered>
<Centered> <div className={classNames.tagline}>(so far today: {getTodaysProgress(goal)} minutes)</div></Centered>

            <Row>
              <BasicButton buttonProps={{ onClick: () => addMinutes(targetMinutes)}}>
                {`Add ${targetMinutes} minutes to today's goal`}
              </BasicButton>
              {extraMinutes > 0 && (
                <BasicButton buttonProps={{ onClick: () => window.alert('Not yet implemented.') }}>
                  {`Add ${targetMinutes + extraMinutes} minutes to today's goal`}
                </BasicButton>
              )}
            </Row></Column></div>)
}

export const Timer_Finished = ({
  targetTime,
  onReset,
  onRepeat,
  activeGoal
}: {
  targetTime: number
  onReset: () => void
  onRepeat: () => void
  activeGoal?: Goal | null
}) => {
  const {  seconds, minutes, } = useStopwatch({
    autoStart: true,
  })

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
              +{minutes}m {seconds}s
            </Row>


            <Row>
              <BasicButton buttonProps={{ onClick: onRepeat }}>Repeat</BasicButton>
              <BasicButton buttonProps={{ onClick: onReset }}>New target</BasicButton>
            </Row>
          </Column>
        </div>
      </Row>
      {activeGoal && 
<UpdateActiveGoal goal={activeGoal} targetMinutes={secondsToMinutes(targetTime)} extraMinutes={minutes}/>
}
    </div>
  )
}

export const Timer = () => {
  const [targetTime, setTargetTime] = useState(minutesToSeconds(20))
  const [timerState, setTimerState] = useState('finished')
  const [onCompletePlay] = useSound('https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/sounds/Success%203.wav')
  const {goal} = useActiveTimeBasedGoal()

  return (
    <>
      <div style={{ backgroundColor: 'var(--secondary-light)', padding: '10px 20px' }}>
        <Centered>
          <h2>
            <FontAwesomeIcon icon={faTools} /> In Progress <FontAwesomeIcon icon={faTools} />
          </h2>
        </Centered>
        <p>
          This tool is under development. Feel free to try it out, but it may not work very well! Expect frequent
          tweaks.
        </p>
        <h3>Upcoming changes:</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>{"click to update today's progress"}</li>
           <li>{"beautification"}</li>
        </ul>
      </div>
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
    </>
  )
}
