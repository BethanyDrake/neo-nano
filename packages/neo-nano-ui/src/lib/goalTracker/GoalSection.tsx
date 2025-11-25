'use client'

import { UpdateVisibilityButton } from '@/lib/buttons/UpdateVisibilityBotton'
import { Record, Visibility } from '@/lib/types/forum.types'
import { WordsPerDay } from '@/lib/goalTracker/WordsPerDay'
import { Centered, Column, Row } from '@/lib/layoutElements/flexLayouts'
import { setGoalVisibility } from '@/lib/serverFunctions/goals/setGoalVisibility'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { differenceInCalendarDays, parseISO, startOfToday } from 'date-fns'
import { useState } from 'react'
import { SmallIconButton } from '../buttons/ExtendableIconButton'
import { EditGoalModal } from '../modals/EditGoalModal'
import { deleteGoal } from '../serverFunctions/goals/deleteGoal'
import { CumulativeWords } from './CumulativeWords'
import classNames from './goalTracker.module.css'
import { toCumulative } from './recordUtils'
import { StatsCard } from './StatsCard'
import { UpdateWordCount } from './UpdateWordCount'
import { useLoadableOnClick } from '../buttons/usLoadableOnClick'
import { CumulativeSwitch } from './CumulativeSwitch'
import { useMyGoalContext } from '../context/MyGoalsContext'
type GoalProps = {
  id: string
  title: string
  initialRecords: (number | null)[]
  visibility: Visibility
  lengthDays: number
  startDate: string
  target: number
}

const getTotal = (cumulativeRecords: Record[]) => {
  if (cumulativeRecords.length === 0) return 0
  return cumulativeRecords[cumulativeRecords.length - 1] ?? 0
}

export const GoalSection = ({ id, title, target, lengthDays, startDate, initialRecords, visibility }: GoalProps) => {
  const [records, setRecords] = useState<(number | null)[]>(initialRecords)
  const [isCumulative, setIsCumulative] = useState(false)
  const cumulativeRecords = toCumulative(records)
  const { setGoals } = useMyGoalContext()

  const _updateGoalVisibility = async (newVisibility: Visibility) => {
    const updatedGoals = await setGoalVisibility({ id, visibility: newVisibility })
    setGoals(updatedGoals)
  }

  const {onClick: _deleteGaol, isLoading: isDeleteGoalLoading} = useLoadableOnClick( () => {
    return deleteGoal(id).then(setGoals)
  })

  const total = getTotal(cumulativeRecords)
  const challengeDay = differenceInCalendarDays(startOfToday(), parseISO(startDate))
  const dailyTarget = Math.round(target / lengthDays)
  const todaysProgress = records[challengeDay] ?? 0

  return (
    <Column style={{ padding: '16px' }}>
      <Row justifyContent="space-between" style={{ padding: '1em 0' }}>
        <Row alignItems="center">
          <h3>{title}</h3>
          <UpdateVisibilityButton onClick={_updateGoalVisibility} visibility={visibility} />
          <EditGoalModal
            initialGoal={{
              id,
              title,
              target,
              lengthDays,
              startDate,
              visibility,
            }}
          />
        </Row>
        <SmallIconButton id="delete" onClick={_deleteGaol} isLoading={isDeleteGoalLoading} icon={faTrash} text="delete goal" variant="angry" />
      </Row>
      <Row>
        <StatsCard title="Today" total={todaysProgress} target={dailyTarget}></StatsCard>
        <StatsCard title="Total" total={total} target={target}></StatsCard>
      </Row>
      <Centered>
        <CumulativeSwitch isCumulative={isCumulative} setIsCumulative={setIsCumulative}/>
      </Centered>
      <div className={classNames['goal-row']}>
        <UpdateWordCount
          key={`${isCumulative ? 'cumulative' : 'per day'}`}
          isCumulative={isCumulative}
          id={id}
          records={records}
          setRecords={setRecords}
          startDate={startDate}
          lengthDays={lengthDays}
        />
        {isCumulative ? (
          <CumulativeWords title={title} cumulativeWordCount={cumulativeRecords} lengthDays={lengthDays} />
        ) : (
          <WordsPerDay title={title} wordCountPerDay={records} lengthDays={lengthDays} target={target} />
        )}
      </div>
    </Column>
  )
}
