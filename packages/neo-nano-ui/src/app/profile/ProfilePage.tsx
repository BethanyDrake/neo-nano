'use client'
import { NewAwardModal } from '@/lib/awards/NewAwardModal'
import { TrophyCase } from '@/lib/awards/TrophyCase'
import { useMyGoalContext } from '@/lib/context/MyGoalsContext'
import { useProfileContext } from '@/lib/context/ProfileContext'
import { GoalSection } from '@/lib/goalTracker/GoalSection'
import { SuggestNextGoal } from '@/lib/goalTracker/SuggestNextGoal'
import { Row } from '@/lib/layoutElements/flexLayouts'
import { FullWidthPage } from '@/lib/layoutElements/FullWidthPage'
import { AddGoalModal } from '@/lib/modals/AddGoalModal'
import { EditProfileModal } from '@/lib/modals/EditProfileModal'
import { SettingsModal } from '@/lib/modals/SettingsModal'
import { getChallengeEndDate } from '@/lib/serverFunctions/goals/goalUtils'
import { Goal } from '@/lib/types/forum.types'
import { useRequireLogin } from '@/lib/useRequireLogin'
import { isFuture } from 'date-fns'

export const isActiveOrUpcoming = (goal: Goal):boolean => {
  const endDate = getChallengeEndDate(goal.startDate, goal.lengthDays)
  return isFuture(endDate)
}

export const ProfilePageInner = () => {
  const { profile,  awards } = useProfileContext()
  const{ goals, isLoading: isLoadingGoals } = useMyGoalContext()

  useRequireLogin()

  return (
    <FullWidthPage>
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

      {goals.filter(isActiveOrUpcoming).length === 0 && !isLoadingGoals && (
       <SuggestNextGoal/>
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
    </FullWidthPage>
  )
}
