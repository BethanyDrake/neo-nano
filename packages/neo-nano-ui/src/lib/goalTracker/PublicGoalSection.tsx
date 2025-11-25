import { ClientSideOnly } from '@/lib/ClientSideOnly'
import { Goal } from '@/lib/types/forum.types'
import { WordsPerDay } from '@/lib/goalTracker/WordsPerDay'
import { Centered } from '@/lib/layoutElements/flexLayouts'
import classNames from './goalTracker.module.css'

export const PublicGoalSection = ({ goal }: { goal: Pick<Goal, 'title' | 'records' |'lengthDays' | 'target' | 'metric'> }) => {
  const { title, records, lengthDays, target, metric } = goal
  return (
    <div style={{ padding: '16px' }}>
      <Centered>
        <h2>{title}</h2>
      </Centered>
      <ClientSideOnly>
        <div className={classNames['goal-row']}>
          <WordsPerDay title={title} wordCountPerDay={records} lengthDays={lengthDays} target={target} metric={metric}/>
        </div>
      </ClientSideOnly>
    </div>
  )
}
