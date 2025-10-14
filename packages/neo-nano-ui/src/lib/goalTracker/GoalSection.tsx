'use client'

import { UpdateVisibilityButton } from '@/lib/buttons/UpdateVisibilityBotton'
import { Record, Visibility } from '@/lib/forum.types'
import { WordsPerDay } from '@/lib/goalTracker/WordsPerDay'
import { Centered, Column, LeftRow, Row } from '@/lib/layout'
import { setGoalVisibility } from '@/lib/serverFunctions/goals/setGoalVisibility'
import { updateGoalProgress } from '@/lib/serverFunctions/goals/updateGoalProgress'
import { useState } from 'react'
import classNames from './goalTracker.module.css'
import { UpdateWordCount } from './UpdateWordCount'
import { Switch } from '@headlessui/react'
import { CumulativeWords } from './CumulativeWords'
import { toCumulative } from './recordUtils'
import { SmallIconButton } from '../buttons/ExtendableIconButton'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { deleteGoal } from '../serverFunctions/goals/deleteGoal'
import { useProfileContext } from '../context/ProfileContext'

type GoalProps = {
  id: string
  title: string
  initialRecords: (number | null)[]
  initialVisibility: Visibility
  lengthDays: number
  startDate: string
  target: number
}

const getTotal = (cumulativeRecords: Record[]) => {
  if (cumulativeRecords.length === 0) return 0
  return cumulativeRecords[cumulativeRecords.length - 1] ?? 0
}

export const GoalSection = ({
  id,
  title,
  target,
  lengthDays,
  startDate,
  initialRecords,
  initialVisibility,
}: GoalProps) => {
  const [records, setRecords] = useState<(number | null)[]>(initialRecords)
  const [isCumulative, setIsCumulative] = useState(false)
  const cumulativeRecords = toCumulative(records)
  const [visibility, setVisibility] = useState<Visibility>(initialVisibility)
  const {setGoals} = useProfileContext()
  const onCancel = () => {
    setRecords(initialRecords)
  }
  const onSave = async () => {
    await updateGoalProgress({ id, records })
    console.log('Successfuly updated!')
  }

  const _updateGoalVisibility = async (newVisibility: Visibility) => {
    await setGoalVisibility({ id, visibility: newVisibility })
    setVisibility(newVisibility)
  }
  const _deleteGaol = async () => {
    deleteGoal(id).then(setGoals)
  }

  return (
    <Column style={{ padding: '16px' }}>
      <Row justifyContent='space-between' style={{padding: '1em 0'}}>
      <Row alignItems='center'>
        <h2>{title}</h2>
        <UpdateVisibilityButton onClick={_updateGoalVisibility} visibility={visibility} />
        <SmallIconButton id="edit" icon={faEdit} text="edit goal" />
      </Row>
       <SmallIconButton id="delete" onClick={_deleteGaol} icon={faTrash} text="delete goal" variant='angry' />
      </Row>

      <LeftRow>
        <div className={classNames.statCard}>Goal: {target.toLocaleString()}</div>
        <div className={classNames.statCard}>Total: {getTotal(cumulativeRecords).toLocaleString()} words</div>
      </LeftRow>
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
