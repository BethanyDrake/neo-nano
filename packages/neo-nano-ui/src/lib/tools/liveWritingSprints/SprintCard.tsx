import { Sprint } from "@/lib/serverFunctions/sprints/recordPrivateSprint"
import classNames from './liveSprints.module.css'
import { TextButton } from "@/lib/buttons/BasicButton"

export type UpcomingLiveSprint = Omit<Sprint, 'visibility'>
export type PastLiveSprint = Omit<Sprint, 'visibility'>

export const formatStartTime = (startTime: Date) => {
  return startTime.toLocaleTimeString(undefined, {hourCycle: 'h24', timeStyle: 'short'})
}


export const UpcomingSprintCard = ({ startTime, durationSeconds}: UpcomingLiveSprint) => {
    return (<div className={classNames.expandableCard}>
        <div className={classNames.startTime}>{formatStartTime(startTime)}</div>
        <div className={classNames.duration}>{durationSeconds / 60}m</div>
        <TextButton>register</TextButton>
        </div>)
}

export const PastSprintCard = ({ startTime, durationSeconds}: PastLiveSprint) => {
    return (<div className={classNames.pastSprintCard}><div className={classNames.startTime}>{formatStartTime(startTime)}</div><div className={classNames.duration}>{durationSeconds / 60}m</div></div>)
}