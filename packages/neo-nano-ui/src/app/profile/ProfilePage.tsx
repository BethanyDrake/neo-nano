'use client'
import { NewAwardModal } from '@/lib/awards/NewAwardModal'
import { TrophyCase } from '@/lib/awards/TrophyCase'
import { BasicButton } from '@/lib/buttons/BasicButton'
import { useLoadableOnClick } from '@/lib/buttons/usLoadableOnClick'
import { useProfileContext } from '@/lib/context/ProfileContext'
import { Column, Row } from '@/lib/layout'
import { ADD_GOAL_MODAL, AddGoalModal } from '@/lib/modals/AddGoalModal'
import { EditProfileModal } from '@/lib/modals/EditProfileModal'
import { useModalContext } from '@/lib/modals/ModalContext'
import { joinCurrentChallenge } from '@/lib/serverFunctions/goals/joinCurrentChallenge'
import { useRequireLogin } from '@/lib/useRequireLogin'
import classNames from './profile.module.css'
import dynamic from 'next/dynamic'

const GoalSection = dynamic(() =>
  import('@/lib/goalTracker/GoalSection').then((mod) => mod.GoalSection), {ssr: false}
)


export const ProfilePageInner = () => {
  const { profile, goals, setGoals, awards } = useProfileContext()
  const { setOpenModal } = useModalContext()
  useRequireLogin()

  const { onClick: joinChallenge, isLoading: isJoinChallengeLoading } = useLoadableOnClick(() => {
    return joinCurrentChallenge().then(setGoals)
  })

  return (
    <div style={{ padding: '24px' }}>
      <Row alignItems="center">
        <h1>My Profile</h1> <EditProfileModal />
      </Row>
      <h2>{profile.displayName}</h2>
      {profile.role === 'moderator' && <p>Moderator</p>}
      <p>{profile.aboutMe}</p>

      <TrophyCase awards={awards} />

      <Row alignItems="center">
        <h2>Goals</h2>
        <AddGoalModal />
      </Row>

      {goals.length === 0 && (
        <div className={classNames.noGoalsContainer}>
          <Column style={{ alignItems: 'center' }}>
            <div>No goals so far.</div>
            <BasicButton buttonProps={{ onClick: joinChallenge }} isLoading={isJoinChallengeLoading}>
              Join Novel November
            </BasicButton>{' '}
            or{' '}
            <BasicButton buttonProps={{ onClick: () => setOpenModal(ADD_GOAL_MODAL) }}>Add a custom goal</BasicButton>
          </Column>
        </div>
      )}

      {goals.map(({ id, title, records, visibility, target, lengthDays, startDate }) => (
        <GoalSection
          id={id}
          key={id}
          title={title}
          initialRecords={records}
          visibility={visibility}
          lengthDays={lengthDays}
          startDate={startDate}
          target={target}
        />
      ))}

      <NewAwardModal />
    </div>
  )
}
