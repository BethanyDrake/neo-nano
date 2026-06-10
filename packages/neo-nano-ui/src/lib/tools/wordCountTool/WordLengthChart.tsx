'use client'
import classes from './wordCountTool.module.css'
import {
  Bar,
  BarChart,
  Label,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from 'recharts'


import { WordLengthDatum } from './countWords'

const MyTooltip = ({ active, payload }: TooltipContentProps<string | number, string>) => {
  const isVisible = active && payload && payload.length
  const {length, count } = payload[0]?.payload ?? {}
 
  return (
    <div style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
      {isVisible && (
        <div className={classes.Tooltip}>
          <div>{length} letters</div>
          <div>x{count}</div>
        </div>
      )}
    </div>
  )
}

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
         <Tooltip content={(MyTooltip)} />
      </BarChart>
    </ResponsiveContainer>
  )
}
