'use client'

import { Bar, BarChart, Label, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type Props = {
  title: string
  wordCountPerDay: number[]
}

export const WordsPerDay = ({ title, wordCountPerDay }: Props) => {
  const data = wordCountPerDay.map((wordCount, i) => ({
    wordCount,
    day: i + 1,
  }))

  return (
      <ResponsiveContainer height={400}>
        <BarChart
          title={title}
          accessibilityLayer
          data={data}
          margin={{
            bottom: 0,
            left: 16,
            right: 24,
            top: 48,
          }}
          syncMethod="index"
        >
          <YAxis>
            <Label value="word count" position="top" angle={0} offset={24} />
          </YAxis>
          <XAxis dataKey={'day'} domain={[1, 30]}>
            <Label value="day" position="bottom" />
          </XAxis>

          <Bar dataKey="wordCount" fill="#1ab394" />
          <ReferenceLine y={1667} stroke="#5e53a5ff" strokeDasharray="3 3" />
        </BarChart>
      </ResponsiveContainer>
  )
}
