'use client'

import { Bar, BarChart, Label, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Record } from '../forum.types'

type Props = {
  title: string
  wordCountPerDay: Record[]
  lengthDays: number
  target: number
}

export const WordsPerDay = ({ title, wordCountPerDay, lengthDays, target }: Props) => {
  const data = wordCountPerDay.map((wordCount, i) => ({
    wordCount,
    day: i + 1,
  }))

  const dailyTarget = target/lengthDays

  return (
      <ResponsiveContainer height={400}>
        <BarChart
          title={title}
          accessibilityLayer
          data={data}
          margin={{
            bottom: 24,
            left: 16,
            right: 24,
            top: 48,
          }}
          syncMethod="index"
        >
          <YAxis stroke='var(--text-colour-2)'>
            <Label value="word count" position="top" angle={0} offset={24} />
          </YAxis>
          <XAxis stroke='var(--text-colour-2)' dataKey={'day'} domain={[1, lengthDays]}>
            <Label value="challenge day" position="bottom" />
          </XAxis>

          <Bar dataKey="wordCount" fill="#1ab394" />
          <ReferenceLine y={dailyTarget} stroke="#5e53a5ff" strokeDasharray="3 3" />
        </BarChart>
      </ResponsiveContainer>
  )
}
