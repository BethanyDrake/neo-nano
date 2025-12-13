import { BasicButton } from '../buttons/BasicButton'
import { useLoadableOnClick } from '../buttons/usLoadableOnClick'
import { getCurrentChallenge, getUpcomingChallenge } from '../challenges'
import { useMyGoalContext } from '../context/MyGoalsContext'
import { Column } from '../layoutElements/flexLayouts'
import { ADD_GOAL_MODAL } from '../modals/AddGoalModal'
import { useModalContext } from '../modals/ModalContext'
import { joinChallenge } from '../serverFunctions/goals/joinCurrentChallenge'
import classNames from './goalTracker.module.css'

const getChallengeToJoin = () => {
  const currentChallenge = getCurrentChallenge()
  return currentChallenge || getUpcomingChallenge()
}

export const NoGoalsOnProfile = () => {
  const { setGoals } = useMyGoalContext()
  const { setOpenModal } = useModalContext()
  const challengeToJoin = getChallengeToJoin()

  const { onClick: onClickJoinChallenge, isLoading: isJoinChallengeLoading } = useLoadableOnClick(() => {
    if (!challengeToJoin) throw Error()
    return joinChallenge(challengeToJoin.id).then(setGoals)
  })

  return (
    <div className={classNames.noGoalsContainer}>
      <Column style={{ alignItems: 'center' }}>
        <div>No goals so far.</div>
        {challengeToJoin && (
          <>
            <BasicButton buttonProps={{ onClick: onClickJoinChallenge }} isLoading={isJoinChallengeLoading}>
              Join {challengeToJoin?.title}
            </BasicButton>{' '}
            or{' '}
          </>
        )}
        <BasicButton buttonProps={{ onClick: () => setOpenModal(ADD_GOAL_MODAL) }}>Add a custom goal</BasicButton>
      </Column>
    </div>
  )
}
