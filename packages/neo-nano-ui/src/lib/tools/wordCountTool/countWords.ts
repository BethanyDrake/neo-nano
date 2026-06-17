import _ from "lodash"

const getWords = (text: string) => {
    return text.split(/\W+/).filter((word) => word.length > 0).map((word) => word.toLowerCase())
}
export const countWords = (text: string) => {
    const words = getWords(text)
    return words.length
}

export type WordLengthDatum = {length: number, count: number, percentage: number}
export const getWordLengths = (text: string): WordLengthDatum[]  => {

const words = getWords(text);
    const wordLengths: Record<number, number> = {}
    words.forEach((word) => {
        const length = word.length
        if (!wordLengths[length]) {
            wordLengths[length] = 1
        } else {
            wordLengths[length] += 1
        }
    })

    const unsortedLengths = 
        Object.entries(wordLengths).map(([key, value]) => ({length: +key, count: value}))
    const sortedLengths = _.sortBy(unsortedLengths, 'length')
    const withPercentages = sortedLengths.map((entry) => ({...entry, percentage: (entry.count * 100/ words.length)}))

    return withPercentages

}


export type CountWords2Datum = {
    length: number,
    wordCounts: {
        word: string,
        count: number
    }[]
}

export const countWords2 = (text: string): CountWords2Datum[] => {
    const words = getWords(text)
    const dict: Record<number, Record<string, number>> = {}
    words.forEach((word) => {
        const length = word.length
        if (!dict[length]) {
            dict[length] = {}
        }
        if (!dict[length][word]) {
            dict[length][word] = 0
        }
        dict[length][word] += 1
    
    })
    const sortedResult =_.orderBy(Object.entries(dict).map(([length, subDict]) => ({
        length: parseInt(length),
        wordCounts: _.orderBy(Object.entries(subDict).map(([word, count]) => ({word, count})), 'count', 'desc').slice(0, 10)
    })),'asc') 
    return sortedResult
}
