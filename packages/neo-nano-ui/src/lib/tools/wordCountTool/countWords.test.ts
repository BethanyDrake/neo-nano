import { countWords, getWordLengths } from "./countWords"

describe('count words', () => {
    test('counts words', () => {
        expect(countWords('')).toEqual(0)
        expect(countWords('Once upon a time...')).toEqual(4)
        expect(countWords('to-day')).toEqual(2)
        expect(countWords('Wow—an em dash!')).toEqual(4)
        expect(countWords("Sha'n't")).toEqual(3)
        expect(countWords(`"Hi," he said.`)).toEqual(3)
        expect(countWords(`No, Mr. Bond, I expect you to die.`)).toEqual(8)
        expect(countWords('  trailing  spaces  ')).toEqual(2)
    })

    test('getWordLengths', () => {
        expect(getWordLengths('Once upon a time...')).toEqual([
            {length: 1, count: 1, percentage: 25},
            {length: 4, count: 3, percentage: 75}
        ])
    })
})