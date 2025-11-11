import { differenceInCalendarDays, parseISO } from 'date-fns'

export const dateToChallengeDay = (goalStartDate: string, date: string | Date) => {
  const _date = typeof date === 'string' ? parseISO(date) : date
  const _startDate = parseISO(goalStartDate)
  console.log("dateToChallengeDay", {_date, _startDate})
  return differenceInCalendarDays(_date, _startDate)
}

export const isActive = (startDate: string, length_days: number, date: string): boolean => {
    const challengeDay = dateToChallengeDay(startDate, date)

    return challengeDay >= 0 && challengeDay < length_days
}