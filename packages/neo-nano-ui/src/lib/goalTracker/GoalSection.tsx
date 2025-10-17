'use client'

import { UpdateVisibilityButton } from '@/lib/buttons/UpdateVisibilityBotton'
import { Record, Visibility } from '@/lib/forum.types'
import { WordsPerDay } from '@/lib/goalTracker/WordsPerDay'
import { Centered, Column, Row } from '@/lib/layout'
import { setGoalVisibility } from '@/lib/serverFunctions/goals/setGoalVisibility'
import { updateGoalProgress } from '@/lib/serverFunctions/goals/updateGoalProgress'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { Switch } from '@headlessui/react'
import { differenceInCalendarDays } from 'date-fns'
import { useState } from 'react'
import { SmallIconButton } from '../buttons/ExtendableIconButton'
import { useProfileContext } from '../context/ProfileContext'
import { EditGoalModal } from '../modals/EditGoalModal'
import { deleteGoal } from '../serverFunctions/goals/deleteGoal'
import { CumulativeWords } from './CumulativeWords'
import classNames from './goalTracker.module.css'
import { toCumulative } from './recordUtils'
import { StatsCard } from './StatsCard'
import { UpdateWordCount } from './UpdateWordCount'
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
  const { setGoals } = useProfileContext()
  const onCancel = () => {
    setRecords(initialRecords)
  }
  const onSave = async () => {
    await updateGoalProgress({ id, records })
    console.log('Successfuly updated!')
  }

  const _updateGoalVisibility = async (newVisibility: Visibility) => {
    const updatedGoals = await setGoalVisibility({ id, visibility: newVisibility })
    setGoals(updatedGoals)
  }
  const _deleteGaol = async () => {
    deleteGoal(id).then(setGoals)
  }
  const total = getTotal(cumulativeRecords)
  const challengeDay = differenceInCalendarDays(new Date(), startDate)
  console.log(challengeDay)
  const dailyTarget = Math.round(target / lengthDays)
  const todaysProgress = records[challengeDay] ?? 0

  return (
    <Column style={{ padding: '16px' }}>
      <Row justifyContent="space-between" style={{ padding: '1em 0' }}>
        <Row alignItems="center">
          <h2>{title}</h2>
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
        <SmallIconButton id="delete" onClick={_deleteGaol} icon={faTrash} text="delete goal" variant="angry" />
      </Row>
      <Row>
        <StatsCard title="Today" total={todaysProgress} target={dailyTarget}></StatsCard>
        <StatsCard title="Total" total={total} target={target}></StatsCard>
      </Row>
      <Centered>
        <Switch checked={isCumulative} className={classNames.switchContainer} onChange={setIsCumulative}>
          <span className={isCumulative ? classNames.inactiveMode : classNames.activeMode}>Words Per Day</span>
          <span> • </span>
          <span className={isCumulative ? classNames.activeMode : classNames.inactiveMode}>Cumulative</span>
        </Switch>
      </Centered>
      <div className={classNames['goal-row']}>
        <UpdateWordCount
          key={`${isCumulative ? 'cumulative' : 'per day'}`}
          isCumulative={isCumulative}
          onCancel={onCancel}
          onSave={onSave}
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
