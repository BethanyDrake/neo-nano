import { GoalSection } from "@/lib/goalTracker/GoalSection";
import { PublicGoalSection } from "@/lib/goalTracker/PublicGoalSection";
import { WordsPerDay } from "@/lib/goalTracker/WordsPerDay";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";


const genreData = [
  {
    "genre": "Fantasy",
    "A": 50,
  },
  {
    "genre": "Romance",
    "A": 90,
  },
   {
    "genre": "Sci-fi",
    "A": 20,
  },
  {
    "genre": "Sci-fi",
    "A": 20,
  },
]
export default async function Page() {

  return <div>
    <h1>Analytics (Sample)</h1>
    <p>{"Once November begins, this is where aggregated data from all users will be displayed, broken down, and painstakingly colour-coded. I can't wait"}!</p>

    <h2>Genre Breakdown</h2>
    <RadarChart
  style={{ width: '100%', maxWidth: '500px', maxHeight: '70vh', aspectRatio: 1 }}
  responsive
  data={data}
>
  <PolarGrid />
  <PolarAngleAxis dataKey="genre" />
  <PolarRadiusAxis angle={30} domain={[0, 150]} />
  <Radar name="Mike" stroke="#6e1ab3" fill="#6e1ab3" fillOpacity={0.6} />
  <Legend />
</RadarChart>

    <h2>Daily Average</h2>
    <WordsPerDay title="daily average" wordCountPerDay={[]} lengthDays={30} target={50000}/>
  </div>
}