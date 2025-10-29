import { differenceInCalendarDays } from 'date-fns'

export const dateToChallengeDay = (goalStartDate: string, date: string | Date) => {
  const _date = typeof date === 'string' ? new Date(date) : date
  return differenceInCalendarDays(_date, new Date(goalStartDate))
}
