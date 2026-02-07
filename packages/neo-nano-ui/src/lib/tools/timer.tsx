'use client'
import { BasicButton } from '@/lib/buttons/BasicButton'
import formClasses from '@/lib/expandableForms/form.module.css'
import { useActiveGoal } from '@/lib/goalTracker/quickUpdate/ActiveGoalContext'
import { Centered, Column, LeftRow, Row } from '@/lib/layoutElements/flexLayouts'
import { track } from '@vercel/analytics'
import confetti from 'canvas-confetti'
import { minutesToSeconds } from 'date-fns'
import { minutesInDay } from 'date-fns/constants'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useStopwatch, useTimer } from 'react-timer-hook'
import { ToastContainer, toast } from 'react-toastify'
import useSound from 'use-sound'
import sprintTimerImage from './images/sprint-timer.png'
import { PausePlayToggle } from './PausePlayToggle'
import { SprintTable } from './SprintTable'
import classNames from './timer.module.css'
import { plural1 } from '../misc'
import { completePrivateSprint, createPrivateSprint, getMySprintLog, cancelPrivateSprint, Sprint, UserSprint } from '../serverFunctions/sprints/recordPrivateSprint'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const Timer_Initial = ({ startTimer }: { startTimer: (durationSeconds: number) => void }) => {
  const { handleSubmit, register } = useForm<{ minutes: string }>()
  return (
    <div>
      <Centered>
        <h1>Start a timer</h1>
      </Centered>
      <Row>
        <Image alt="clock" width={100} height={100} src={sprintTimerImage} />

        <form
          className={[formClasses.form, classNames.content].join(' ')}
          onSubmit={handleSubmit(({ minutes }) => {
            startTimer(minutesToSeconds(parseInt(minutes)))
          })}
        >
          <Column>
            <LeftRow alignItems="baseline">
              <input
                type="number"
                min={0}
                max={minutesInDay - 1}
                id="time"
                placeholder="20"
                {...register('minutes', { required: true })}
              />
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
  const { seconds, minutes, hours, isRunning, pause, resume } = useTimer({
    expiryTimestamp: getExpiryTimestamp(targetTime),
    onExpire: onFinished,
  })

  return (
    <div>
      <Centered>
        <h1>The clock is ticking...</h1>
      </Centered>
      <LeftRow style={{ flexGrow: 1 }}>
        <Image alt="clock" width={100} height={100} src={sprintTimerImage} />

        <div>
          <Column>
            <Row alignItems="center">
              <div>{formatTimeString({ hours, minutes, seconds })}</div>
              <PausePlayToggle pause={pause} resume={resume} isRunning={isRunning} />
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

const formatTimeString = ({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }): string => {
  const hours_s = `${hours}h`
  return `${hours > 0 ? hours_s : ''} ${minutes}m ${seconds}s`
}

export const Timer_Finished = ({
  targetTime,
  onSubmitWordCount,
}: {
  targetTime: number
  onReset: () => void
  onRepeat: () => void
  onSubmitWordCount:  (sprint: Pick<UserSprint, 'wordCount' | 'durationSeconds'>) => Promise<void>
}) => {
  const { seconds, minutes, pause, start, isRunning, totalSeconds } = useStopwatch({
    autoStart: true,
  })
  useEffect(() => {
    confetti({
      disableForReducedMotion: true,
      spread: 90,
      colors: ['#C0E5C8', '#1ab394', '#6e1ab3', '#d8a9ffff'],
    })
  }, [])

  const [isLoading, setIsLoading] = useState(false)
  const { handleSubmit, register } = useForm<{
    wordCount: string
    includeOvertime: boolean
    updateActiveGoal: boolean
  }>()

  const { activeGoal, addToTodaysTotal } = useActiveGoal()
  return (
    <div>
      <Centered>
        <h1>Complete!</h1>
      </Centered>
      <Row>
        <Image alt="clock" width={100} height={100} src={sprintTimerImage} />

        <form
          className={[formClasses.form, classNames.content].join(' ')}
          onSubmit={handleSubmit(async ({ wordCount, updateActiveGoal , includeOvertime}) => {
            if(isLoading) return
            setIsLoading(true)
            const parsedWordCount = parseInt(wordCount)
            const targetSeconds = targetTime
            const durationSeconds = includeOvertime ? targetSeconds + totalSeconds : targetSeconds
            if (activeGoal?.metric === 'words' && updateActiveGoal) {
              addToTodaysTotal(parsedWordCount, {onSuccess: () => toast(`added ${plural1(parsedWordCount, 'word' , )} to ${activeGoal.title}`, {position: "bottom-center", hideProgressBar: true,})})
            }
             if (activeGoal?.metric === 'minutes' && updateActiveGoal) {
              const minutesToAdd = Math.round(durationSeconds / 60)
              addToTodaysTotal(minutesToAdd, {onSuccess: () => toast(`added ${plural1( minutesToAdd, 'minute' ,)} to ${activeGoal.title}`, {position: "bottom-center",hideProgressBar: true,})})
            }
            await onSubmitWordCount({ wordCount: parsedWordCount, durationSeconds})
            setIsLoading(false)
          })}
        >
          <Column>

            <LeftRow alignItems="baseline">
              <div>+{formatTimeString({ hours: 0, minutes, seconds })}</div>
              <PausePlayToggle pause={pause} resume={start} isRunning={isRunning} />
            </LeftRow>
            <LeftRow alignItems="baseline">
              <input
                type="number"
                min={0}
                id="wordCount"
                {...register('wordCount', { required: true })}
              />
              <label htmlFor="wordCount">words</label>
            </LeftRow>
                       
            <label>
              <LeftRow>
                <div className={formClasses.checkboxContainer}>
              <input type="checkbox" {...register('includeOvertime')}/></div>
             Include overtime  </LeftRow></label>

            {activeGoal && (
              <label>
                <LeftRow>
                  <div className={formClasses.checkboxContainer}>
                    <input type="checkbox" {...register('updateActiveGoal')} />
                  </div>
                  Update {activeGoal?.title}
                </LeftRow>
              </label>
            )}
            <BasicButton isLoading={isLoading}>Submit</BasicButton>
          </Column>
        </form>
      </Row>
    </div>
  )
}

export const Timer = () => {
  const [targetTime, setTargetTime] = useState(minutesToSeconds(20))
  const [timerState, setTimerState] = useState('initial')
  const [onCompletePlay] = useSound('https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/sounds/Success%203.wav')
  const [pendingPromise, setPendingPromise] = useState<Promise<Sprint | null>>(Promise.resolve(null))
  const {data: sprints} = useQuery({queryKey: ['my-sprint-log'], queryFn: getMySprintLog})
  const queryClient = useQueryClient()


  return (
    <>
      <Centered>
        <div className={classNames.Timer}>
          {timerState === 'initial' && (
            <Timer_Initial
              startTimer={(durationSeconds) => {
                track('StartTimer', { targetTime: durationSeconds })
                const createSprintPromise = createPrivateSprint(new Date(), durationSeconds)
                pendingPromise.then( () => setPendingPromise(createSprintPromise))
               
                setTargetTime(durationSeconds)
                setTimerState('inProgress')
              }}
            />
          )}

          {timerState === 'inProgress' && (
            <Timer_InProgress
              onCancel={async () => {
                setTimerState('initial')
                const activeSprint = await pendingPromise;
                if(activeSprint) {
                  const cancelPromise = cancelPrivateSprint(activeSprint.id)
                  setPendingPromise(cancelPromise.then(() => null))
                }
              }}
              onFinished={() => {
                onCompletePlay()
                setTimerState('finished')
              }}
              targetTime={targetTime}
            />
          )}

          {timerState === 'finished' && (
            <Timer_Finished
              targetTime={targetTime}
              onReset={() => setTimerState('initial')}
              onRepeat={() => setTimerState('inProgress')}
              onSubmitWordCount={async ({ durationSeconds, wordCount }) => {
                const currentSprint = await pendingPromise
                if (!currentSprint) {
                  console.error('no active sprint :(')
                } else {
                  await completePrivateSprint(currentSprint.id, durationSeconds, wordCount)
                  queryClient.invalidateQueries({queryKey: ['my-sprint-log']})
                  setPendingPromise(Promise.resolve(null))
                }
                
                setTimerState('initial')
              }}
            />
          )}
        </div>
      </Centered>
     {sprints && <SprintTable sprints={sprints} />}
     
            <ToastContainer/>
    </>
  )
}
