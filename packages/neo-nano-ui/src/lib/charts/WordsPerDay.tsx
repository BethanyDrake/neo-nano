import { Bar, BarChart, Label, ResponsiveContainer, XAxis, YAxis } from "recharts"

const mockData = new Array(30).fill(0).map((_, i) => ( {
          wordCount: Math.round(Math.random()*3000),
          name: 'Page A',
          day: i+1
        }))


export const WordsPerDay = () =>{
  return (
  <ResponsiveContainer
    height={400}
    width="100%"
  >
    <BarChart
    
      accessibilityLayer
      data={mockData}
      margin={{
        bottom: 124,
        left: 16,
        right: 24,
        top: 124,
      }}
      syncMethod="index"
    >
      <YAxis>      <Label value="word count" position="top" angle={0} offset={24}  /></YAxis>
      <XAxis dataKey={'day'} domain={[1, 30]} >      <Label value="day" position="bottom" /></XAxis>

      <Bar dataKey="wordCount" fill="#1ab394" />
    </BarChart>
  </ResponsiveContainer>)}