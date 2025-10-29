export const COMMENTS_PER_PAGE = 25
export const THREADS_PER_PAGE = 25

export const getDateAsString = (date: Date) => {
return date.toISOString().slice(0, 10) 
}