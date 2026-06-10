import _ from "lodash"

const getWords = (text: string) => {
    return text.split(/\W+/).filter((word) => word.length > 0)
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