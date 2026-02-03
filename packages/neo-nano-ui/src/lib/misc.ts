import { format } from "date-fns"

export const COMMENTS_PER_PAGE = 25
export const THREADS_PER_PAGE = 25

export const getDateAsString = (date: Date) => {

    return format(date, 'yyyy-MM-dd')
}

export const truncateText = (text: string) => {
  const targetLength = 100
    if(text.length <= targetLength) {
        return text
    }
    
    return `${text.slice(0, targetLength)}...`
}

export const plural = (word: string, n: number) => `${word}${n === 1 ? '' : 's'}`

export const plural1 = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`