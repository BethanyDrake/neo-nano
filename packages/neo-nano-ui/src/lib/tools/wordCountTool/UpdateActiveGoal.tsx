import { Centered, Column } from '@/lib/layoutElements/flexLayouts'
import { Goal } from '@/lib/types/forum.types'
import { useUpdateActiveGoal } from '../focusClockTool/useActiveGoal'
import classNames from '../timer.module.css'
import { getTodaysProgress } from '@/lib/goalTracker/recordUtils'
import { track } from '@vercel/analytics'
import { plural1 } from '@/lib/misc'
import { BasicButton } from '@/lib/buttons/BasicButton'

export const UpdateActiveGoal = ({
  goal,
  wordCount,
  hasUpdatedActiveGoal,
  setHasUpdatedActiveGoal
}: {
  goal: Goal
  wordCount: number
  hasUpdatedActiveGoal: boolean
  setHasUpdatedActiveGoal: (b: boolean) => void
  
}) => {
  const { addValue: addWords } = useUpdateActiveGoal(goal)
  const todaysTotal = getTodaysProgress(goal)

  return (
    <div className={[classNames.UpdateActiveGoal, classNames.secondary].join(' ')}>
      <Column gap="5px">
        <Centered>
          <h3>Update {goal.title}</h3>
        </Centered>
        <Centered>
          <div>(so far today: {todaysTotal} words)</div>
        </Centered>

        <Column>
          <BasicButton
            buttonProps={{
              onClick: () => {
                addWords(wordCount)
                track('UpdateActiveGoal',  {wordsAdded: wordCount, location: 'wordCountTool'})
                setHasUpdatedActiveGoal(true)
              },
              disabled: wordCount<1 || hasUpdatedActiveGoal
            }}
          >
            +{plural1(wordCount, 'word')}
          </BasicButton>
          {wordCount > todaysTotal && 
          <BasicButton
            buttonProps={{
              onClick: () => {
                addWords(wordCount - todaysTotal)
                track('UpdateActiveGoal',  {wordsAdded: wordCount, location: 'wordCountTool'})
                setHasUpdatedActiveGoal(true)
              },
              disabled: hasUpdatedActiveGoal
            }}
          >
            {"Update today's total"} (+{plural1(wordCount - todaysTotal, 'word')})
          </BasicButton>}
        </Column>
      </Column>
    </div>
  )
}