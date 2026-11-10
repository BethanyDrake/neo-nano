'use client'
import classes from './goalTracker.module.css'

import {
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from 'recharts'

import { Goal, Record } from '@/lib/types/forum.types'
type Props = {
  title: string
  cumulativeRecords: Record[]
  lengthDays: number
  target: number
  metric: Goal['metric']
}

const CumulativeProgressTooltip = ({ active, payload }: TooltipContentProps<number, number>) => {
  const isVisible = active && payload && payload.length
  const { day, record, expected } = payload[0]?.payload ?? {}

  return (
    <div style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
      {isVisible && (
        <div className={classes.Tooltip}>
          <div className={classes.day}>Day {day}</div>
          <div className={classes.target}>Target: {Math.round(expected)}</div>
          <div className={classes.actual}>Actual: {record}</div>
        </div>
      )}
    </div>
  )
}

export const CumulativeProgressChart = ({ title, cumulativeRecords, lengthDays, target, metric }: Props) => {
  const data = cumulativeRecords.map((record, i) => ({
    record,
    day: i + 1,
    expected: (i + 1) * (target / lengthDays),
  }))

  return (
    <ResponsiveContainer height={400}>
      <LineChart
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
        <YAxis domain={[0, Math.max(target, cumulativeRecords.at(-1) ?? 0)]}>
          <Label value={`${metric}`} position="top" angle={0} offset={24} />
        </YAxis>
        <XAxis dataKey={'day'} domain={[1, lengthDays]}>
          <Label value="challenge day" position="bottom" />
        </XAxis>

        <Line dataKey="record" fill="var(--primary-vibrant)" stroke="var(--primary-vibrant)" />
        <Line dataKey="expected" stroke="var(--grey-dark)" strokeDasharray="3 3" dot={false} />
        <Tooltip content={CumulativeProgressTooltip} />
      </LineChart>
    </ResponsiveContainer>
  )
}
