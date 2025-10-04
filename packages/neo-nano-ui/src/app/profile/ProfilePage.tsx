'use client'

import { BasicButton } from '@/lib/buttons/BasicButton'
import { UpdateVisibilityButton } from '@/lib/buttons/UpdateVisibilityBotton'
import { WordsPerDay } from '@/lib/charts/WordsPerDay'
import { useProfileContext } from '@/lib/context/ProfileContext'
import { Goal, Visibility } from '@/lib/forum.types'
import { Row } from '@/lib/layout'
import { EditProfileModal } from '@/lib/modals/EditProfileModal'
import { joinCurrentChallenge } from '@/lib/serverFunctions/goals/joinCurrentChallenge'
import { setGoalVisibility } from '@/lib/serverFunctions/goals/setGoalVisibility'
import { updateGoalProgress } from '@/lib/serverFunctions/goals/updateGoalProgress'
import { UpdateWordCount } from '@/lib/UpdateWordCount'
import { isSameDay } from 'date-fns'
import { useState } from 'react'
import classNames from './profile.module.css'

type GoalProps = {
  id: string
  title: string
  initialRecords: number[]
}

const hasJoinedCurrentChallenge = (goals: Goal[]) => {
  return goals.some(({ startDate }) => {
    return isSameDay(startDate, '2025-11-01')
  })
}

const GoalSection = ({ id, title, initialRecords }: GoalProps) => {
  const [records, setRecords] = useState<number[]>(initialRecords)
  const [visibility, setVisibility] = useState<Visibility>('private')
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

export const ProfilePageInner = () => {
  const { profile, goals, setGoals } = useProfileContext()
  const joinChallenge = () => joinCurrentChallenge().then(setGoals)

  return (
    <div style={{ padding: '24px' }}>
      <Row alignItems="center">
        <h1>My Profile</h1> <EditProfileModal />
      </Row>
      <h2>{profile.displayName}</h2>
      {profile.role === 'moderator' && <p>Moderator</p>}
      <p>{profile.aboutMe}</p>
      {!hasJoinedCurrentChallenge(goals) && (
        <BasicButton buttonProps={{ onClick: joinChallenge }}>Join the challenge</BasicButton>
      )}

      {goals.map(({ id, title, records }) => (
        <GoalSection id={id} key={id} title={title} initialRecords={records} />
      ))}
    </div>
  )
}
