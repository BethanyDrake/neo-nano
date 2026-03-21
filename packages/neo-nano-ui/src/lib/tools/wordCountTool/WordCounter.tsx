'use client'
import { useForm } from 'react-hook-form'

import formClasses from '@/lib/expandableForms/form.module.css'
import { BasicButton } from '@/lib/buttons/BasicButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Centered, Column, LeftRow, Row } from '@/lib/layoutElements/flexLayouts'
import { useState } from 'react'
import { countWords } from './countWords'
import { Goal } from '@/lib/types/forum.types'
import { useActiveGoal, useUpdateActiveGoal } from '../focusClockTool/useActiveGoal'
import classNames from '../timer.module.css'
import { getTodaysProgress } from '@/lib/goalTracker/recordUtils'
import { track } from '@vercel/analytics'
import { plural1 } from '@/lib/misc'

type Inputs = {
  text: string
}

const UpdateActiveGoal = ({
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

  return (
    <div className={[classNames.UpdateActiveGoal, classNames.secondary].join(' ')}>
      <Column gap="5px">
        <Centered>
          <h3>Update {goal.title}</h3>
        </Centered>
        <Centered>
          <div>(so far today: {getTodaysProgress(goal)} words)</div>
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
        </Column>
      </Column>
    </div>
  )
}

export const WordCounter = () => {
  const { handleSubmit, register, reset } = useForm<Inputs>()
  const [analysis, setAnalysis] = useState<{ wordCount: number }>()
  const { goal:activeGoal } = useActiveGoal('words')
  const [hasUpdatedActiveGoal, setHasUpdatedActiveGoal] = useState(false)
  const _onSubmit = (data: Inputs) => {
    const wordCount = countWords(data.text)
    setAnalysis({ wordCount })
    setHasUpdatedActiveGoal(false)
  }

  return (
    <>
      <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
        <textarea style={{ width: '100%', height: '10em' }} {...register('text')} />
        <Row justifyContent="right">
          <BasicButton
            buttonProps={{
              type: 'button',
              onClick: () => {
                setAnalysis(undefined)
                reset()
              },
            }}
          >
            Clear
          </BasicButton>
          <BasicButton>
            Analyse <FontAwesomeIcon icon={faArrowRight} />
          </BasicButton>
        </Row>
      </form>

      {analysis && (
        <div>
          <h2>Analysis:</h2>
          <LeftRow alignItems="baseline">
            <h3>Word Count:</h3> <p>{analysis.wordCount}</p>
          </LeftRow>

          {activeGoal && <UpdateActiveGoal goal={activeGoal} wordCount={analysis.wordCount} hasUpdatedActiveGoal={hasUpdatedActiveGoal} setHasUpdatedActiveGoal={setHasUpdatedActiveGoal}/>}
        </div>
      )}
    </>
  )
}
