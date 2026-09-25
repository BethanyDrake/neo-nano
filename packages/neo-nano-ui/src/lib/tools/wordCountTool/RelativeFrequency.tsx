// base frequency
// relative frequency
// x-axis: chapter (5,000 words...)
// y-axis relative frequency
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, LabelList, Dot } from 'recharts'
import { useMemo } from 'react'
import { getWords } from './countWords'
import _ from 'lodash'

export const getWordFrequencies = (text: string): Record<string, number> => {
  const words = getWords(text)
  const totalWords = words.length

  const wordCounts: Record<string, number> = {}
  words.forEach((word) => {
    const prev = wordCounts[word] ?? 0
    wordCounts[word] = prev + 1
  })

  const frequencies: Record<string, number> = {}
  Object.keys(wordCounts).forEach((word) => {
    frequencies[word] = wordCounts[word] / totalWords
  })

  return frequencies
}

export const getRelativeFrequency = (partialText: string, frequencies: Record<string, number>) => {
  const partialFrequencies = getWordFrequencies(partialText)
  const relativeFrequencies: Record<string, number> = {}
  Object.keys(partialFrequencies).forEach((word) => {
    if (!frequencies[word]) return
    const relativeFrequency = partialFrequencies[word] / frequencies[word]
    relativeFrequencies[word] = relativeFrequency
  })

  return relativeFrequencies
}

export const splitIntoChapters = (text: string, chapterLength = 3000 * 5) => {
  const chapters = []
  let i = 0
  do {
    chapters.push(text.slice(i, i + chapterLength))
    i += chapterLength
  } while (i < text.length)

  return chapters
}

const sortFrequencies = (frequency: Record<string, number>): { word: string; frequency: number, rank: number }[] => {
  const frequencyList = Object.entries(frequency).map(([key, value]) => ({
    word: key,
    frequency: value,
  }))

  return _.sortBy(frequencyList, 'frequency').reverse().slice(0, 10).map((a, i) => ({...a, rank: (10-i)}))
}

export const getRelativeFrequencies = (
  text: string,
  chapterLength = 3000 * 5,
): { word: string; frequency: number }[][] => {
  const chapters = splitIntoChapters(text, chapterLength)
  const frequencies = getWordFrequencies(text)
  const unsortedFrequencies = chapters.map((chapter) => {
    return getRelativeFrequency(chapter, frequencies)
  })
  return unsortedFrequencies.map(sortFrequencies)
}

export const RelativeFrequency = ({ text }: { text: string }) => {
  const relativeFrequencies = useMemo(() => {
    return getRelativeFrequencies(text)
  }, [text])

  const data = relativeFrequencies.flatMap((frequencies, index) =>
    frequencies.map(({ word, frequency, rank }) => ({ word, frequency, rank,  chapter: index + 1 })),
  )
  console.log(data)
  return (
    <ScatterChart style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}>
      <Scatter name="A school" data={data} shape={<Dot r={20}/>}>
        <LabelList dataKey="word" />
      </Scatter>
      <YAxis dataKey={'rank'} />
      <XAxis dataKey="chapter" />
      <Tooltip />
    </ScatterChart>
  )
}
