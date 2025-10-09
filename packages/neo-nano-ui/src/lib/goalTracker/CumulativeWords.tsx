'use client'

import { Label, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import {Record} from '@/lib/forum.types'
type Props = {
  title: string
  cumulativeWordCount: Record[]
}

export const CumulativeWords = ({ title, cumulativeWordCount }: Props) => {
  const data = cumulativeWordCount.map((wordCount, i) => ({
    wordCount,
    day: i + 1,
  }))

  return (
      <ResponsiveContainer height={400}>
        <LineChart
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

          <Line dataKey="wordCount" fill="#1ab394" />
          <ReferenceLine y={50000} stroke="#5e53a5ff" strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
  )
}
