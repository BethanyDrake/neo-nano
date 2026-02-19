import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Tooltip } from 'recharts'
import { Project } from './Project.type'
import { capitalize } from 'lodash'

export const AspectChart = ({ aspects }: { aspects: Project['aspects'] }) => {
  const data = Object.entries(aspects).map(([key, value]) => ({
    name: capitalize(key),
    value,
  }))
  return (
    <RadarChart
      accessibilityLayer
      barCategoryGap="10%"
      barGap={4}
      cx="50%"
      cy="50%"
      data={data}
      endAngle={-270}
      height={300}
      innerRadius={0}
      layout="centric"
      margin={{
        bottom: 5,
        left: 5,
        right: 5,
        top: 5,
      }}
      outerRadius="80%"
      stackOffset="none"
      startAngle={90}
      syncMethod="index"
      width={800}
    >
      <PolarAngleAxis dataKey="name" />
      <PolarGrid />
      <Tooltip defaultIndex={1} />
      <Radar
        dataKey="value"
        fill="var(--primary-vibrant)"
        fillOpacity={0.5}
        stroke="var(--primary-vibrant)"
        strokeOpacity={0.7}
        strokeWidth={3}
      />
    </RadarChart>
  )
}
