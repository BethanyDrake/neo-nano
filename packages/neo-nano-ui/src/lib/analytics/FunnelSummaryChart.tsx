'use client'
import { FunnelChart, Funnel, LabelList, Trapezoid, Label } from 'recharts';
import { FunnelTrapezoidItem } from 'recharts/types/cartesian/Funnel';
import { PyramidEntry } from './getPyramidOfProgressData';
import { use } from 'react';

const colours = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c']

const FunnelWithDimensions = (props: FunnelTrapezoidItem) => {
  return (
    <>
      <Trapezoid {...props}  fillOpacity={0.2} />

      <Label position="insideBottom"value={`${props.value?.toLocaleString()} writers`} viewBox={props.labelViewBox} />
      <Label position="middle" value={props.name} viewBox={props.labelViewBox} />
    </>
  );
};

const FunnelExample = ({ milestoneUserCounts }: { milestoneUserCounts: Promise<PyramidEntry[]> }) => {
  const data = use(milestoneUserCounts).map(({milestone, writerCount}, index) => {
    return {
      name: `${milestone/1000}K`,
      value: writerCount,
      fill: colours[index]
    }

    
  })
  console.log({data})
  return (
    <FunnelChart
      style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
      responsive
      margin={{
        right: 30,
      }}
    >
      <Funnel
        dataKey="value"
        data={data}
        isAnimationActive
        activeShape={FunnelWithDimensions}
        reversed
      >
        <LabelList position="middle" fill="#ffffff" stroke="none" dataKey="name" offset={20} />
      </Funnel>
    </FunnelChart>
  );
};

export default FunnelExample;
