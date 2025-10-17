'use client'
import { BasicButton } from '@/lib/buttons/BasicButton'
import { useProfileContext } from '@/lib/context/ProfileContext'
import { GoalSection } from '@/lib/goalTracker/GoalSection'
import { Column, Row } from '@/lib/layout'
import { ADD_GOAL_MODAL, AddGoalModal } from '@/lib/modals/AddGoalModal'
import { EditProfileModal } from '@/lib/modals/EditProfileModal'
import { useModalContext } from '@/lib/modals/ModalContext'
import { joinCurrentChallenge } from '@/lib/serverFunctions/goals/joinCurrentChallenge'
import { sendGTMEvent } from '@next/third-parties/google'
import classNames from './profile.module.css'

export const ProfilePageInner = () => {
  const { profile, goals, setGoals } = useProfileContext()
  const {setOpenModal} = useModalContext()
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

      <Row alignItems="center">
        <h2>Goals</h2>
        <AddGoalModal/>
      </Row>

      {goals.length === 0 && (
        <div className={classNames.noGoalsContainer}>
          <Column style={{ alignItems: 'center' }}>
            <div>No goals so far.</div>
            <BasicButton buttonProps={{ onClick: joinChallenge }}>Join Novel November</BasicButton> or{' '}
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
    </div>
  )
}
