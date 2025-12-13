import { hoursToMinutes, isFuture, isPast, parseISO } from 'date-fns'
import { getChallengeEndDate } from './serverFunctions/goals/goalUtils'
import { Goal } from './types/forum.types'

export type Challenge = Pick<Goal, 'title' | 'startDate' | 'lengthDays' | 'target' | 'metric'> & {
  id: string
}

// listed in order of start date
const challenges: Challenge[] = [
  {
    title: 'Novel November',
    startDate: '2025-11-01',
    lengthDays: 30,
    target: 50000,
    metric: 'words',
    id: 'novel-november-2025'
  },
  {
    title: 'The Eighty Hour Edit',
    startDate: '2026-01-01',
    lengthDays: 60,
    target: hoursToMinutes(80),
    metric: 'minutes',
     id: '80h-edit-2026'
  },
]

export const getChallengeById = (id: string) => challenges.find((challenge) => challenge.id === id)

export const getCurrentChallenge = () => {
  return challenges.find((challenge) => {
    const startDate = parseISO(challenge.startDate)
    const endDate = getChallengeEndDate(challenge.startDate, challenge.lengthDays)
    return isPast(startDate) && isFuture(endDate)
  })
}

export const getUpcomingChallenge = () => {
  return challenges.find((challenge) => {
    const startDate = parseISO(challenge.startDate)
    return isFuture(startDate)
  })
}

export const getPreviousChallenge = () => {
  return challenges.findLast((challenge) => {
    const endDate = getChallengeEndDate(challenge.startDate, challenge.lengthDays)
    return isPast(endDate)
  })
}
