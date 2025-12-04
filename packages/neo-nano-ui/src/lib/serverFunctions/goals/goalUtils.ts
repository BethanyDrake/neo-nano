import { addDays, differenceInCalendarDays, endOfDay, parseISO } from 'date-fns'

export const dateToChallengeDay = (goalStartDate: string, date: string | Date) => {
  const _date = typeof date === 'string' ? parseISO(date) : date
  const _startDate = parseISO(goalStartDate)
  return differenceInCalendarDays(_date, _startDate)
}

export const isActive = (startDate: string, length_days: number, date: string): boolean => {
    const challengeDay = dateToChallengeDay(startDate, date)

    return challengeDay >= 0 && challengeDay < length_days
}

export const getChallengeEndDate = (startDate: string, lengthDays: number): Date => {
  return endOfDay(addDays(parseISO(startDate), lengthDays-1))
}