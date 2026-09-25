import { getRelativeFrequencies, getWordFrequencies, splitIntoChapters } from './RelativeFrequency'

describe('getWordFrequencies', () => {
  test('empty', () => {
    expect(getWordFrequencies('')).toEqual({})
  })

  test('frequencies', () => {
    expect(getWordFrequencies('one two two three three three')).toEqual({
      one: 1 / 6,
      two: 2 / 6,
      three: 3 / 6,
    })
  })
})

describe('split into chapters', () => {
  test('split into exactly 5 chapters', () => {
    expect(splitIntoChapters('1234567890', 2)).toEqual(['12', '34', '56', '78', '90'])
  })

  test('final chapter is shorter', () => {
    expect(splitIntoChapters('12345678901', 2)).toEqual(['12', '34', '56', '78', '90', '1'])
  })
})

describe('getRelativeFrequencies', () => {
  test('blah', () => {
    expect(getRelativeFrequencies('11 ', 3)).toEqual([[{ word: '11', frequency: 1 }]])
  })

  test('blah2', () => {
    const [chapter1, chapter2, chapter3] = getRelativeFrequencies('one two three one one three two two three', 14)
    expect(chapter1).toEqual([
      { word: 'three', frequency: 1 },
      { word: 'two', frequency: 1 },
      { word: 'one', frequency: 1 },
    ])

    expect(chapter2).toEqual([
      { word: 'one', frequency: 2 },
      { word: 'three', frequency: 1 },
    ])

    expect(chapter3).toEqual([
      { word: 'two', frequency: 2 },
      { word: 'three', frequency: 1 },
    ])
  })
})
