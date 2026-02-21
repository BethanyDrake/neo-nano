'use client'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Tooltip, TooltipContentProps } from 'recharts'
import { Project } from './Project.type'
import { capitalize } from 'lodash'
import classNames from './tooltip.module.css'


const MyTooltip = ({label, payload}: TooltipContentProps<number, string>) => {

  return (<div className={classNames.Tooltip}><div>{label}:</div><div style={{fontWeight: 'normal'}}>{JSON.stringify(payload[0]?.value)}</div></div>)
}

type DataType = {
  name: string,
  value: number
  max: number
}

export const AspectChart = ({ aspects }: { aspects: Project['aspects'] }) => {
  const data: DataType[] = Object.entries(aspects).map(([key, value]) => ({
    name: capitalize(key),
    value,
    max: 100
  }))
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
      <PolarAngleAxis dataKey="name"/>
      <PolarGrid />
      <Tooltip defaultIndex={1} content={MyTooltip}/>
      <Radar
        dataKey="value"
        fill="var(--primary-vibrant)"
        fillOpacity={0.5}
        stroke="var(--primary-vibrant)"
        strokeOpacity={0.7}
        strokeWidth={3}
      />
      <Radar
        dataKey="max"
        fillOpacity={0}
        strokeOpacity={0}
      />
    </RadarChart>
  )
}
