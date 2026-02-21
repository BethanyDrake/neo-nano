'use client'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Tooltip, TooltipContentProps } from 'recharts'
import { Aspect, Project } from './Project.type'
import { capitalize, maxBy } from 'lodash'
import classNames from './tooltip.module.css'
import { aspectDefinitions } from './aspects'

const MyTooltip = ({ label, payload }: TooltipContentProps<number, string>) => {
  const aspect: Aspect = payload[0]?.payload?.key ?? 'fantasy'
  console.log(payload)
  return (
    <div className={classNames.Tooltip} style={{borderColor: aspectDefinitions[aspect].colour}}>
      <div>{label}:</div>
      <div style={{ fontWeight: 'normal' }}>{JSON.stringify(payload[0]?.value)}</div>
    </div>
  )
}

type DataType = {
  name: string
  value: number
  max: number
  key: Aspect
}

export const AspectChart = ({ aspects }: { aspects: Project['aspects'] }) => {
  const data: DataType[] = Object.entries(aspects).map(([key, value]) => ({
    name: capitalize(key),
    key: key as Aspect,
    value,
    max: 100,
  }))

  const dominantAspect: Aspect = maxBy(data, ({ value }) => value)?.key ?? 'fantasy'

  return (
    <RadarChart
      accessibilityLayer
      data={data}
      height={300}
      margin={{
        bottom: 5,
        left: 5,
        right: 5,
        top: 5,
      }}
      width={350}
    >
      <PolarAngleAxis dataKey="name" />
      <PolarGrid />
      <Tooltip defaultIndex={1} content={MyTooltip} />
      <Radar
        dataKey="value"
        fill={aspectDefinitions[dominantAspect].colour}
        fillOpacity={0.5}
        stroke={aspectDefinitions[dominantAspect].colour}
        strokeOpacity={0.7}
        strokeWidth={3}
      />
      <Radar dataKey="max" fillOpacity={0} strokeOpacity={0} />
    </RadarChart>
  )
}
