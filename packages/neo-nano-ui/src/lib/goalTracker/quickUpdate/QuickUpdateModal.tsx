'use client'
import { useEffect, useState } from 'react'
import classNames from '@/lib/modals/Modal.module.css'
import formStyles from '@/lib/form.module.css'
import navbarStyles from '@/lib/NavBar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { CumulativeSwitch } from '../CumulativeSwitch'
import { LeftRow, Row } from '../../layout'
import { BasicButton } from '../../buttons/BasicButton'
import { useLoadableOnClick } from '../../buttons/usLoadableOnClick'
import _ from 'lodash'
import { dateToChallengeDay } from '../../serverFunctions/goals/goalUtils'
import { updateRecordsUtil } from '../updateRecordsUtil'
import { useActiveGoal } from './ActiveGoalContext'
import Link from 'next/link'

const QuickUpdateModalForm = ({closeModal}: {closeModal: () => void}) => {
    const [isCumulative, setIsCumulative] = useState(false)
  const {activeGoal, updateActiveGoal} = useActiveGoal()
  const challengeDay = activeGoal ? dateToChallengeDay(activeGoal.startDate, new Date()) : -1

  const [localRecords, setLocalRecords] = useState(activeGoal?.records ?? [])
    const {onClick, isLoading} = useLoadableOnClick(async () => {
    updateActiveGoal(localRecords)
  })

  useEffect(() => {
    setLocalRecords(activeGoal?.records ?? [])
  }, [activeGoal])


  const updateTodaysWordCount = (newValue: number) => {
    console.log("updateTodaysWordCount", {challengeDay, newValue})
    const sanitisedValue = isNaN(newValue) ? 0 : newValue
    setLocalRecords(updateRecordsUtil(challengeDay,sanitisedValue,localRecords, false) )
  }

    const updateCumulativeWordCount = (newValue: number) => {
    const sanitisedValue = isNaN(newValue) ? 0 : newValue
    setLocalRecords(updateRecordsUtil(challengeDay,sanitisedValue,localRecords, true) )
  }
  return (
<form className={formStyles.form} onSubmit={(event) => {event.preventDefault(); onClick()}}>
          <CumulativeSwitch isCumulative={isCumulative} setIsCumulative={setIsCumulative}/>
            <LeftRow>
         {isCumulative ?  (<><label id='total'>Total:</label>
        <input aria-labelledby="total" onChange={(event) => {updateCumulativeWordCount(event.target.valueAsNumber)}} value={_.sum(localRecords.slice(0, challengeDay+1))} type="number" disabled={!isCumulative}></input></>)
        : <><label id='today'>Today:</label>
        <input aria-labelledby="today" onChange={(event) => {updateTodaysWordCount(event.target.valueAsNumber)}} value={localRecords[challengeDay] || ''} type="number" disabled={isCumulative}></input>
        </>}     
        </LeftRow>
        
         <Row>
                  <BasicButton buttonProps={{ onClick: closeModal }}>Cancel</BasicButton>
                  <BasicButton isLoading={isLoading} buttonProps={{ type: 'submit' }}>
                    Save
                  </BasicButton>
                </Row>
        </form>)
}

export const QuickUpdateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {activeGoal} = useActiveGoal()

  return (
    <>
    <button onClick={()=> setIsOpen(true)} className={navbarStyles.responsiveButton}><FontAwesomeIcon icon={faPencil}/>Quick Update</button>
        {isOpen && (
            <>
      <div style={{maxWidth: '300px'}}  className={classNames['modal']}>
        {activeGoal ? <QuickUpdateModalForm closeModal={() => setIsOpen(false)}/> : <div>
          <p>No active goals at the momemt. Try creating one in <Link onClick={() => setIsOpen(false)} href="/profile">your profile.</Link></p>
           <BasicButton buttonProps={{ onClick: () => setIsOpen(false) }}>Cancel</BasicButton>{' '}
          </div>}
        
      </div>

      <div className={classNames['modal-overlay']} /></>)}
    </>)
  
}
