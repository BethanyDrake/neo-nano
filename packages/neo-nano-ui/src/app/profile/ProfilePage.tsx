'use client'

import { BasicButton } from '@/lib/buttons/BasicButton'
import { WordsPerDay } from '@/lib/charts/WordsPerDay'
import { EditProfileModal } from '@/lib/modals/EditProfileModal'
import { Goal, Profile } from '@/lib/forum.types'
import { Centered, Row } from '@/lib/layout'
import { UpdateWordCount } from '@/lib/UpdateWordCount'
import { isSameDay } from 'date-fns'
import { useEffect, useState } from 'react'
import classNames from './profile.module.css'
import { updateGoalProgress } from '@/lib/apiUtils/goals/updateGoalProgress'
import { joinCurrentChallenge } from '@/lib/apiUtils/goals/joinCurrentChallenge'
import { getMyGoals } from '@/lib/apiUtils/goals/getMyGoals'

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
  'use client'
  const [records, setRecords] = useState<number[]>(initialRecords)

  const onCancel = () => {
    setRecords(initialRecords)
  }
  const onSave = async () => {
    await updateGoalProgress({id, records})
    console.log('Successfuly updated!')
  }

  return (
    <div style={{ padding: '16px' }}>
      <Centered>
        <h2>{title}</h2>
      </Centered>
      <div className={classNames['goal-row']}>
        <UpdateWordCount onCancel={onCancel} onSave={onSave} records={records} setRecords={setRecords} />
        <WordsPerDay title={title} wordCountPerDay={records} />
      </div>
    </div>
  )
}

export const ProfilePageInner = ({ initalProfile }: { initalProfile: Profile }) => {
  const joinChallenge = () => joinCurrentChallenge().then(setGoals)
  const [goals, setGoals] = useState<Goal[]>([])
  const [profile, setProfile] = useState<Profile>(initalProfile)

  useEffect(() => {
    getMyGoals().then(setGoals)
  }, [])

  return (
    <div style={{ padding: '24px' }}>
      <Row alignItems="center">
        <h1>My Profile</h1> <EditProfileModal onUpdate={(updatedProfile: Profile) => setProfile(updatedProfile)} />
      </Row>
      <h2>{profile.displayName}</h2>
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
