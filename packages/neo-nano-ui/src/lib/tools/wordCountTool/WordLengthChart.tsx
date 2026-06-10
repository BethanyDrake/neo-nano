'use client'

import {
  Bar,
  BarChart,
  Label,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'


import { WordLengthDatum } from './countWords'

export const WordLengthChart = ({ wordLengths}: {wordLengths: WordLengthDatum[]}) => {

  return (
    <ResponsiveContainer height={400}>
      <BarChart
        accessibilityLayer
        data={wordLengths}
        margin={{
          bottom: 24,
          left: 16,
          right: 24,
          top: 48,
        }}
        syncMethod="index"
      >
        <YAxis yAxisId={'left'} stroke="var(--text-colour-2)" dataKey="percentage"  tickFormatter={(value) => `${value}%`}>

        </YAxis>


        <XAxis stroke="var(--text-colour-2)" dataKey={'length'} allowDuplicatedCategory>
            <Label value="word length" position="bottom" />
        </XAxis>
        <Bar dataKey="count" fill="var(--secondary-vibrant)" radius={[20, 20, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
