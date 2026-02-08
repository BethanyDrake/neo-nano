import { secondsToMinutes } from "date-fns"
import classNames from './timer.module.css'
import { CompletedSprint } from "../serverFunctions/sprints/recordPrivateSprint"

const myFormatDuration = (durationSeconds: number) => {
    const seconds =  durationSeconds % 60
    const  minutes =  secondsToMinutes(durationSeconds)
    if (seconds > 0) return `${minutes}m ${seconds}s`
    return `${minutes}m`
}

export const SprintTable = ({sprints}: {sprints: CompletedSprint[]}) => {
    return (
    <>
    <h2>Sprint Log:</h2>
    <table className={classNames.SprintTable}>
      <thead>
        <tr>
        <th/>
        <th>Duration</th>
        <th>Word count</th>
        <th>Speed</th>
        </tr>
      </thead>
  <tbody>
      {sprints.map(({id, durationSeconds, wordCount}) => (<tr key={id}>
        <th>Sprint {id}</th>
        <td>{myFormatDuration(durationSeconds)}</td>
        <td>{wordCount} words</td>
        <td>{(wordCount * 60 / durationSeconds ).toFixed(1)} w/m</td>
        </tr>))}</tbody>
      </table></>)
}