'use client'

import { Bar, Line, ComposedChart, Label, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { CompletedSprint } from '@/lib/serverFunctions/sprints/recordPrivateSprint'
import { formatStartTime } from './SprintTable'

type Datum = {
  wordCount?: number
  speed?: number
  startTime: string
  id: number
}

export const SprintChart = ({ sprints }: { sprints: CompletedSprint[] }) => {
  const data: Datum[] = new Array(10).fill({}).map((_, i) => ({ id: i + 1, startTime: '' }))

  sprints.forEach(({ wordCount, durationSeconds, startTime }, i) => {
    data[i].wordCount = wordCount
    data[i].speed = (wordCount * 60) / durationSeconds
    data[i].startTime = formatStartTime(startTime)
  })

  console.log(data)

  return (
    <ResponsiveContainer height={400}>
      <ComposedChart
        title="Sprint History"
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
        <YAxis yAxisId={'left'} stroke="var(--text-colour-2)" dataKey="speed">
          <Label value="w/m" position="top" angle={0} offset={24} />
        </YAxis>

        <YAxis yAxisId={'right'} stroke="var(--text-colour-2)" dataKey="wordCount" orientation="right">
          <Label value="words" position="top" angle={0} offset={24} />
        </YAxis>

        <XAxis type="category" stroke="var(--text-colour-2)" dataKey={'startTime'} allowDuplicatedCategory></XAxis>

        {/* <XAxis tick={false} stroke='var(--text-colour-2)' dataKey={"id"} allowDuplicatedCategory></XAxis> */}
        <Bar dataKey="wordCount" fill="var(--tertiary-light)" />
        <Line dataKey="speed" stroke="var(--primary-vibrant)" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
