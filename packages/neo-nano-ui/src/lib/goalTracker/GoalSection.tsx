'use client'

import { UpdateVisibilityButton } from '@/lib/buttons/UpdateVisibilityBotton'
import { Visibility } from '@/lib/forum.types'
import { WordsPerDay } from '@/lib/goalTracker/WordsPerDay'
import { Row } from '@/lib/layout'
import { setGoalVisibility } from '@/lib/serverFunctions/goals/setGoalVisibility'
import { updateGoalProgress } from '@/lib/serverFunctions/goals/updateGoalProgress'
import { useState } from 'react'
import classNames from './goalTracker.module.css'
import { UpdateWordCount } from './UpdateWordCount'

type GoalProps = {
  id: string
  title: string
  initialRecords: number[]
  initialVisibility: Visibility
}


export const GoalSection = ({ id, title, initialRecords, initialVisibility }: GoalProps) => {
  const [records, setRecords] = useState<number[]>(initialRecords)
  const [visibility, setVisibility] = useState<Visibility>(initialVisibility)
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

  return (
    <div style={{ padding: '16px' }}>
      <Row alignItems='center'>
        <h2>{title}</h2> <UpdateVisibilityButton onClick={_updateGoalVisibility} visibility={visibility}/>
      </Row>
      <div className={classNames['goal-row']}>
        <UpdateWordCount onCancel={onCancel} onSave={onSave} records={records} setRecords={setRecords} />
        <WordsPerDay title={title} wordCountPerDay={records} />
      </div>
    </div>
  )
}