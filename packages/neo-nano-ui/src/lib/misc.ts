import { format } from "date-fns"

export const COMMENTS_PER_PAGE = 25
export const THREADS_PER_PAGE = 25

export const getDateAsString = (date: Date) => {

    return format(date, 'yyyy-MM-dd')
}