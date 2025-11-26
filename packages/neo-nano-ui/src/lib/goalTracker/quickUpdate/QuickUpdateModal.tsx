'use client'
import { useEffect, useState } from 'react'
import classNames from '@/lib/modals/Modal.module.css'
import formStyles from '@/lib/expandableForms/form.module.css'
import navbarStyles from '@/lib/navbar/NavBar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { CumulativeSwitch } from '../CumulativeSwitch'
import { Column, Row } from '../../layoutElements/flexLayouts'
import { BasicButton } from '../../buttons/BasicButton'
import { useLoadableOnClick } from '../../buttons/usLoadableOnClick'
import _ from 'lodash'
import { dateToChallengeDay } from '../../serverFunctions/goals/goalUtils'
import { updateRecordsUtil } from '../updateRecordsUtil'
import { useActiveGoal } from './ActiveGoalContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { startOfToday } from 'date-fns'

const QuickUpdateModalForm = ({ closeModal }: { closeModal: () => void }) => {
  const [isCumulative, setIsCumulative] = useState(false)
  const { activeGoal, updateActiveGoal } = useActiveGoal()
  const challengeDay = activeGoal ? dateToChallengeDay(activeGoal.startDate, startOfToday()) : -1
  const [localRecords, setLocalRecords] = useState(activeGoal?.records ?? [])
  const { onClick, isLoading } = useLoadableOnClick(async () => {
    await updateActiveGoal(localRecords)

    closeModal()
  })

  useEffect(() => {
    setLocalRecords(activeGoal?.records ?? [])
  }, [activeGoal])

  const updateTodaysWordCount = (newValue: number) => {
    const sanitisedValue = isNaN(newValue) ? 0 : newValue
    setLocalRecords(updateRecordsUtil(challengeDay, sanitisedValue, localRecords, false))
  }

  const updateCumulativeWordCount = (newValue: number) => {
    const sanitisedValue = isNaN(newValue) ? 0 : newValue
    setLocalRecords(updateRecordsUtil(challengeDay, sanitisedValue, localRecords, true))
  }
  return (
    <form
      className={formStyles.form}
      onSubmit={(event) => {
        event.preventDefault()
        onClick()
      }}
    >
      <Column>
        <h2 style={{ textAlign: 'center' }}>{activeGoal?.title} </h2>
        <Row alignItems="center">
          {isCumulative ? (
            <>
              <label style={{ width: '40px' }} id="total">
                Total:
              </label>
              <input
                aria-labelledby="total"
                onChange={(event) => {
                  updateCumulativeWordCount(event.target.valueAsNumber)
                }}
                value={_.sum(localRecords.slice(0, challengeDay + 1)) ?? 0}
                type="number"
              ></input>
              <span>{activeGoal?.metric}</span>
            </>
          ) : (
            <>
              <label style={{ width: '40px' }} id="today">
                Today:
              </label>
              <input
                aria-labelledby="today"
                onChange={(event) => {
                  updateTodaysWordCount(event.target.valueAsNumber)
                }}
                value={localRecords[challengeDay] ?? 0}
                type="number"
              ></input>
              <span>{activeGoal?.metric}</span>
            </>
          )}
        </Row>

        <BasicButton isLoading={isLoading} buttonProps={{ type: 'submit' }}>
          Save
        </BasicButton>

        <CumulativeSwitch isCumulative={isCumulative} setIsCumulative={setIsCumulative} />
      </Column>
    </form>
  )
}

export const QuickUpdateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { activeGoal, refresh, isRefreshing } = useActiveGoal()
  const pathname = usePathname()

  useEffect(() => {
    refresh()
  }, [pathname, refresh])

  if (pathname === '/profile' || !activeGoal) {
    return null
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={navbarStyles.responsiveButton}>
        <FontAwesomeIcon icon={faPencil} />
        Quick Update
      </button>
      {isOpen && (
        <>
          <div style={{ width: 'unset' }} className={classNames['modal']}>
            {isRefreshing && <FontAwesomeIcon spin icon={faSpinner} />}
            {!isRefreshing && activeGoal && <QuickUpdateModalForm closeModal={() => setIsOpen(false)} />}
            {!isRefreshing && !activeGoal && (
              <div style={{ minWidth: '200px' }}>
                <p>
                  No active goals at the momemt. Try creating one in{' '}
                  <Link onClick={() => setIsOpen(false)} href="/profile">
                    your profile.
                  </Link>
                </p>
              </div>
            )}
          </div>

          <div onClick={() => setIsOpen(false)} className={classNames['modal-overlay']} />
        </>
      )}
    </>
  )
}
