import { differenceInCalendarDays } from 'date-fns'

export const dateToChallengeDay = (goalStartDate: string, date: string | Date) => {
  const _date = typeof date === 'string' ? new Date(date) : date
  return differenceInCalendarDays(_date, new Date(goalStartDate))
}


export const isActive = (startDate: string, length_days: number, date: string): boolean => {
    const challengeDay = dateToChallengeDay(startDate, date)

    return challengeDay >= 0 && challengeDay < length_days
}