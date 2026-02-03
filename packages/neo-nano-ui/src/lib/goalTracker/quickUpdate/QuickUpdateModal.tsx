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
import _ from 'lodash'
import { dateToChallengeDay } from '../../serverFunctions/goals/goalUtils'
import { updateRecordsUtil } from '../updateRecordsUtil'
import { useActiveGoal } from './ActiveGoalContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { startOfToday } from 'date-fns'
import { Goal } from '@/lib/types/forum.types'
import { ModalOverlay, useModalContext } from '@/lib/modals/ModalContext'
import { track } from '@vercel/analytics'

const QuickUpdateModalForm = ({ closeModal, activeGoal }: { closeModal: () => void; activeGoal: Goal }) => {
  const [isCumulative, setIsCumulative] = useState(false)
  const { updateActiveGoal, isRefreshing } = useActiveGoal()
  const challengeDay = activeGoal ? dateToChallengeDay(activeGoal.startDate, startOfToday()) : -1
  const [localRecords, setLocalRecords] = useState(activeGoal?.records ?? [])
  const onClick = () => updateActiveGoal(localRecords, {onSuccess: () => {
    track('UpdateActiveGoal',  {location: 'quickUpdateModal'})
    closeModal()
  }})
  

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

        <BasicButton isLoading={isRefreshing} buttonProps={{ type: 'submit' }}>
          Save
        </BasicButton>

        <CumulativeSwitch metric={activeGoal.metric} isCumulative={isCumulative} setIsCumulative={setIsCumulative} />
      </Column>
    </form>
  )
}

export const QuickUpdateModal = () => {
  const modalId = 'quick-update-modal'
  const { openModal, setOpenModal, closeModal } = useModalContext()
  const { activeGoal, refresh, isRefreshing } = useActiveGoal()
  const pathname = usePathname()
  const isOpen = openModal === modalId


  useEffect(() => {
    refresh()
  }, [pathname, refresh])

  const isDisabled = pathname === '/profile' || !activeGoal

  return (
    <>
      <button disabled={isDisabled} onClick={() => setOpenModal(modalId)} className={navbarStyles.responsiveButton}>
        <FontAwesomeIcon icon={faPencil} />
        Quick Update
      </button>
      {isOpen && (
        <>
          <div style={{ width: 'unset' }} className={classNames['modal']}>
            {isRefreshing && <FontAwesomeIcon spin icon={faSpinner} />}
            {!isRefreshing && activeGoal && (
              <QuickUpdateModalForm key={activeGoal.id} activeGoal={activeGoal} closeModal={closeModal} />
            )}
            {!isRefreshing && !activeGoal && (
              <div style={{ minWidth: '200px' }}>
                <p>
                  No active goals at the momemt. Try creating one in{' '}
                  <Link onClick={closeModal} href="/profile">
                    your profile.
                  </Link>
                </p>
              </div>
            )}
          </div>

          <ModalOverlay />
        </>
      )}
    </>
  )
}
