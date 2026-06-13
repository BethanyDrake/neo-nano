import { MyUpcomingSprint } from '@/lib/serverFunctions/sprints/publicSprint'
import { addSeconds, differenceInMilliseconds } from 'date-fns'

type State = 'not-started' | 'in-progress' | 'finished' | 'review'
export const getNewState = (state: State, nextSprint?: MyUpcomingSprint): { newState: State; delay: number } => {
  if (!nextSprint) {
    if (state === 'finished' || state === 'review') {
        return {
            newState: state,
            delay: 0
        }
    }
    return {
      newState: 'not-started',
      delay: 0,
    }
  }
  const timeUntilStarts = differenceInMilliseconds(nextSprint.startTime, Date.now())
  const timeUntilEnds = differenceInMilliseconds(
    addSeconds(nextSprint.startTime, nextSprint.durationSeconds),
    Date.now(),
  )
  if (state === 'not-started') {
    if (timeUntilEnds <= 0) {
      return {
        newState: 'finished',
        delay: 0,
      }
    }
    if (timeUntilStarts <= 0) {
      return {
        newState: 'in-progress',
        delay: 0,
      }
    }
    return {
      newState: 'in-progress',
      delay: timeUntilStarts,
    }
  }

  if (state === 'in-progress') {
    console.log('timeUntilEnds', timeUntilEnds <= 0)
    if (timeUntilEnds <= 0) {
      return {
        newState: 'finished',
        delay: 0,
      }
    }
    if (timeUntilStarts > 0) {
      return {
        newState: 'not-started',
        delay: 0,
      }
    }
    console.log('AAA', timeUntilEnds)
    return {
      newState: 'finished',
      delay: timeUntilEnds,
    }
  }

  if (state === 'finished' || state === 'review') {
    console.log('timeUntilEnds', timeUntilEnds <= 0)
    if (timeUntilStarts > 0) {
      return {
        newState: 'in-progress',
        delay: timeUntilStarts,
      }
    }

    if (timeUntilEnds > 0) {
      return {
        newState: 'finished',
        delay: timeUntilEnds,
      }
    }
    return {
        newState: state,
        delay: 0
    }
  }

  throw Error(`Unexpected state: ${state}`)
}
