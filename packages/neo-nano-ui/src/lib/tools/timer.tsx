'use client'
import { BasicButton } from '@/lib/buttons/BasicButton'
import formClasses from '@/lib/expandableForms/form.module.css'
import { Centered, Column, Row } from '@/lib/layoutElements/flexLayouts'
import { faTools } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { minutesToSeconds, secondsToMinutes } from 'date-fns'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useStopwatch, useTimer } from 'react-timer-hook'

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

const Timer_Finished = ({
  targetTime,
  onReset,
  onRepeat,
}: {
  targetTime: number
  onReset: () => void
  onRepeat: () => void
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
              <BasicButton buttonProps={{ onClick: () => window.alert('Not yet implemented.') }}>
                {`Add ${secondsToMinutes(targetTime)} minutes to today's goal`}
              </BasicButton>
              {minutes > 0 && (
                <BasicButton buttonProps={{ onClick: () => window.alert('Not yet implemented.') }}>
                  {`Add ${secondsToMinutes(targetTime) + minutes} minutes to today's goal`}
                </BasicButton>
              )}
            </Row>
            <Row>
              <BasicButton buttonProps={{ onClick: onRepeat }}>Repeat</BasicButton>
              <BasicButton buttonProps={{ onClick: onReset }}>New target</BasicButton>
            </Row>
          </Column>
        </div>
      </Row>
    </div>
  )
}

export const Timer = () => {
  const [targetTime, setTargetTime] = useState(minutesToSeconds(20))
  const [timerState, setTimerState] = useState('initial')
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
          <li>chime when timer reaches 0</li>
          <li>{"click to update today's progress"}</li>
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
          onFinished={() => setTimerState('finished')}
          targetTime={targetTime}
        />
      )}

      {timerState === 'finished' && (
        <Timer_Finished
          targetTime={targetTime}
          onReset={() => setTimerState('initial')}
          onRepeat={() => setTimerState('inProgress')}
        />
      )}
    </>
  )
}
