'use client'
import { NewAwardModal } from '@/lib/awards/NewAwardModal'
import { TrophyCase } from '@/lib/awards/TrophyCase'
import { useMyGoalContext } from '@/lib/context/MyGoalsContext'
import { useProfileContext } from '@/lib/context/ProfileContext'
import { GoalSection } from '@/lib/goalTracker/GoalSection'
import { NoGoalsOnProfile } from '@/lib/goalTracker/NoGoalsOnProfile'
import { Row } from '@/lib/layoutElements/flexLayouts'
import { AddGoalModal } from '@/lib/modals/AddGoalModal'
import { EditProfileModal } from '@/lib/modals/EditProfileModal'
import { SettingsModal } from '@/lib/modals/SettingsModal'
import { useRequireLogin } from '@/lib/useRequireLogin'

export const ProfilePageInner = () => {
  const { profile,  awards } = useProfileContext()
  const{ goals, isLoading: isLoadingGoals } = useMyGoalContext()

  useRequireLogin()

  return (
    <div style={{ padding: '24px' }}>
      <Row alignItems="center">
        <h1>My Profile</h1> <EditProfileModal /> <SettingsModal />
      </Row>
      <h2>{profile.displayName}</h2>
      {profile.role === 'moderator' && <p>Moderator</p>}
      <p>{profile.aboutMe}</p>

      <TrophyCase awards={awards} />

      <Row alignItems="center">
        <h2>Goals</h2>
        <AddGoalModal/>
      </Row>

      {goals.length === 0 && !isLoadingGoals && (
       <NoGoalsOnProfile/>
      )}

      {goals.map(({ id, title, records, visibility, target, lengthDays, startDate, metric }) => (
        <GoalSection
          id={id}
          key={id}
          title={title}
          initialRecords={records}
          visibility={visibility}
          lengthDays={lengthDays}
          startDate={startDate}
          target={target}
          metric={metric}
        />
      ))}

      <NewAwardModal />
    </div>
  )
}
