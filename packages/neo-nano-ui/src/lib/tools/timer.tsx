'use client'
import { Centered, Column, Row } from '@/lib/layoutElements/flexLayouts'
import Image from 'next/image'
import formClasses from '@/lib/expandableForms/form.module.css'
import { BasicButton } from '@/lib/buttons/BasicButton'
import { useForm } from 'react-hook-form'
import { minutesToSeconds } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTools } from '@fortawesome/free-solid-svg-icons'

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

const Timer_InProgress = ({ targetTime, onCancel }: { targetTime: number; onCancel: () => void }) => {
  const [isRunning, setIsRunning] = useState(true)
  const [timeLeft, setTimeLeft] = useState(targetTime)
  const intervalIdRef = useRef<NodeJS.Timeout>(undefined)

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => setTimeLeft((prevTimeLeft) => prevTimeLeft - 1), 1000)
    } else {
      clearInterval(intervalIdRef.current)
    }
    return () => clearInterval(intervalIdRef.current)
  }, [isRunning])

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

        <div>
          <Column>
            <Row alignItems="baseline">
              {timeLeft < 0 ? '+' : ''}
              {Math.floor(Math.abs(timeLeft) / 60)}m {Math.abs(timeLeft) % 60}s
            </Row>
            <Row>
              <BasicButton buttonProps={{ onClick: () => setIsRunning(!isRunning) }}>
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
          <li>fix accuracy for longer durations</li>
          <li>{"click to update today's progress"}</li>
          <li>click to repeat the previous time</li>
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
        <Timer_InProgress onCancel={() => setTimerState('initial')} targetTime={targetTime} />
      )}
    </>
  )
}
