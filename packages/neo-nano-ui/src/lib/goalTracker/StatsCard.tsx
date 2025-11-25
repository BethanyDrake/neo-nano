import ProgressBar from '@ramonak/react-progress-bar'
import { Centered, Column } from '../layoutElements/flexLayouts'
import classNames from './goalTracker.module.css'
export const StatsCard = ({ total, target, title, metric }: { total: number; target: number; title: string, metric: string }) => {
  return (
    <div className={classNames.statCard}>
      <Column>
        <Centered style={{ padding: '8px', borderBottom: '1px solid var(--grey-light)' }}>
          <h4>{title}</h4>
        </Centered>
        <div>
          <strong>Goal:</strong> {target.toLocaleString()} {metric}
        </div>
        <div>
          <strong>So far:</strong> {total.toLocaleString()} {metric}
        </div>
        <ProgressBar bgColor="var(--secondary-vibrant)" completed={total} maxCompleted={target} customLabel={`${((total / target) * 100).toFixed(0)}%`} />
      </Column>
    </div>
  )
}
