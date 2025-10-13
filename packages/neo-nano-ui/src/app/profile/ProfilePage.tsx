'use client'
import { BasicButton } from '@/lib/buttons/BasicButton'
import { useProfileContext } from '@/lib/context/ProfileContext'
import { Goal } from '@/lib/forum.types'
import { GoalSection } from '@/lib/goalTracker/GoalSection'
import { Row } from '@/lib/layout'
import { AddGoalModal } from '@/lib/modals/AddGoalModal'
import { EditProfileModal } from '@/lib/modals/EditProfileModal'
import { joinCurrentChallenge } from '@/lib/serverFunctions/goals/joinCurrentChallenge'
import { sendGTMEvent } from '@next/third-parties/google'
import { isSameDay } from 'date-fns'

const hasJoinedCurrentChallenge = (goals: Goal[]) => {
  return goals.some(({ startDate }) => {
    return isSameDay(startDate, '2025-11-01')
  })
}

export const ProfilePageInner = () => {
  const { profile, goals, setGoals } = useProfileContext()
  const joinChallenge = () => {
    sendGTMEvent({ event: 'sign_up', send_to: 'AW-17636227789/2FVrCNqSj6sbEM31zdlB' })
    return joinCurrentChallenge().then(setGoals)
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row alignItems="center">
        <h1>My Profile</h1> <EditProfileModal />
      </Row>
      <h2>{profile.displayName}</h2>
      {profile.role === 'moderator' && <p>Moderator</p>}
      <p>{profile.aboutMe}</p>
      <AddGoalModal />
      {!hasJoinedCurrentChallenge(goals) && (
        <BasicButton buttonProps={{ onClick: joinChallenge }}>Join the challenge</BasicButton>
      )}

      {goals.map(({ id, title, records, visibility, target, lengthDays, startDate }) => (
        <GoalSection
          id={id}
          key={id}
          title={title}
          initialRecords={records}
          initialVisibility={visibility}
          lengthDays={lengthDays}
          startDate={startDate}
          target={target}
        />
      ))}
    </div>
  )
}
