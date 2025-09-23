import { Bar, BarChart,Line, Label, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import {sum} from 'lodash'

type Props = {
  title: string
  wordCountPerDay: number[]
}


export const CumulativeWords = ({ title, wordCountPerDay }: Props) => {
  const data = wordCountPerDay.map((wordCount, i) => ({
    target: (50000/30)*(i+1),
    wordCount,
    cumulativeWordCount: wordCount? sum(wordCountPerDay.slice(0, i)): undefined,
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

          <Line dataKey="cumulativeWordCount" fill="#1ab394" />
                    <Line dataKey="target" fill="#5e53a5ff" dot={false} />
        </LineChart>
      </ResponsiveContainer>
  )
}