import ProgressBar from '@ramonak/react-progress-bar'
import { Centered, Column } from '../layout'
import classNames from './goalTracker.module.css'
export const StatsCard = ({ total, target, title }: { total: number; target: number; title: string }) => {
  return (
    <div className={classNames.statCard}>
      <Column>
        <Centered style={{ padding: '8px', borderBottom: '1px solid var(--grey-light)' }}>
          <h3>{title}</h3>
        </Centered>
        <div>
          <strong>Goal:</strong> {target.toLocaleString()}
        </div>
        <div>
          <strong>So far:</strong> {total.toLocaleString()} words
        </div>
        <ProgressBar bgColor="var(--secondary-vibrant)" completed={total} maxCompleted={target} customLabel={`${((total / target) * 100).toFixed(0)}%`} />
      </Column>
    </div>
  )
}
