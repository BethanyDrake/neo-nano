'use client'
import { NewAwardModal } from '@/lib/awards/NewAwardModal'
import { TrophyCase } from '@/lib/awards/TrophyCase'
import { ExtendableIconButton } from '@/lib/buttons/ExtendableIconButton'
import { useMyGoalContext } from '@/lib/context/MyGoalsContext'
import { useProfileContext } from '@/lib/context/ProfileContext'
import { GoalSection } from '@/lib/goalTracker/GoalSection'
import { SuggestNextGoal } from '@/lib/goalTracker/SuggestNextGoal'
import { Row } from '@/lib/layoutElements/flexLayouts'
import { FullWidthPage } from '@/lib/layoutElements/FullWidthPage'
import { AddGoalModal } from '@/lib/modals/AddGoalModal'
import { AddProjectModal } from '@/lib/modals/AddProjectModal'
import { EditProfileModal } from '@/lib/modals/EditProfileModal'
import { SettingsModal } from '@/lib/modals/SettingsModal'
import { ModeratorOnly } from '@/lib/moderation/ModeratorOnly'
import { useMyProjectsContext } from '@/lib/projects/MyProjectContext'
import { ProjectSection } from '@/lib/projects/ProjectSection'
import { getChallengeEndDate } from '@/lib/serverFunctions/goals/goalUtils'
import { Goal } from '@/lib/types/forum.types'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { isFuture } from 'date-fns'
import { useRouter } from 'next/navigation'

export const isActiveOrUpcoming = (goal: Goal): boolean => {
  const endDate = getChallengeEndDate(goal.startDate, goal.lengthDays)
  return isFuture(endDate)
}

export const Paragraphs = ({rawText}: {rawText?: string | null}) => {
  if (!rawText) return null
  console.log()
  return (<>
  {rawText.split(/$/)}
  </>)
}


export const ProfilePageInner = () => {
  const { profile, awards } = useProfileContext()
  const { goals, isLoading: isLoadingGoals } = useMyGoalContext()
  const { projects } = useMyProjectsContext()
  const router = useRouter()
  return (
    <FullWidthPage>
      <Row alignItems="center">
        <h1>My Profile</h1> <EditProfileModal /> <SettingsModal /> <ExtendableIconButton onClick={() => router.push(`/profile/${profile.id}`) } icon={faArrowRight} text="view"/>
      </Row>
      <h2>{profile.displayName}</h2>
      {profile.role === 'moderator' && <p>Moderator</p>}
      <p style={{whiteSpaceCollapse: 'preserve' }}>{profile.aboutMe}</p>

      <TrophyCase awards={awards} />

      <ModeratorOnly>
        <Row alignItems="center">
          <h2>Projects</h2>
          <AddProjectModal />
        </Row>
        {projects && projects.map((project) => <ProjectSection key={project.id} project={project}/>)}
      </ModeratorOnly>
      <Row alignItems="center">
        <h2>Goals</h2>
        <AddGoalModal />
      </Row>

      {goals.filter(isActiveOrUpcoming).length === 0 && !isLoadingGoals && <SuggestNextGoal />}

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
