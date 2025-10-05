import { ClientSideOnly } from '@/lib/ClientSideOnly'
import { Goal } from '@/lib/forum.types'
import { WordsPerDay } from '@/lib/goalTracker/WordsPerDay'
import { Centered } from '@/lib/layout'
import classNames from './goalTracker.module.css'

export const PublicGoalSection = ({ goal }: { goal: Pick<Goal, 'title' | 'records'> }) => {
  const { title, records } = goal
  return (
    <div style={{ padding: '16px' }}>
      <Centered>
        <h2>{title}</h2>
      </Centered>
      <ClientSideOnly>
        <div className={classNames['goal-row']}>
          <WordsPerDay title={title} wordCountPerDay={records} />
        </div>
      </ClientSideOnly>
    </div>
  )
}
