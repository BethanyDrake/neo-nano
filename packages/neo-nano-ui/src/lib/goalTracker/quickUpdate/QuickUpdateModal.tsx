'use client'
import { useState } from 'react'
import classNames from '@/lib/modals/Modal.module.css'
import formStyles from '@/lib/form.module.css'
import navbarStyles from '@/lib/NavBar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { CumulativeSwitch } from '../CumulativeSwitch'
import { LeftRow } from '../../layout'
import { BasicButton } from '../../buttons/BasicButton'
import { useLoadableOnClick } from '../../buttons/usLoadableOnClick'
import _ from 'lodash'
import { dateToChallengeDay } from '../../serverFunctions/goals/goalUtils'
import { updateRecordsUtil } from '../updateRecordsUtil'
import { useActiveGoal } from './ActiveGoalContext'
import { useForm } from 'react-hook-form'



export const QuickUpdateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCumulative, setIsCumulative] = useState(false)
  const {activeGoal, updateActiveGoal} = useActiveGoal()
  const challengeDay = activeGoal ? dateToChallengeDay(activeGoal.startDate, new Date()) : -1
  const {handleSubmit} = useForm()


  const [localRecords, setLocalRecords] = useState(activeGoal?.records ?? [])
    const {onClick, isLoading} = useLoadableOnClick(async () => {
    updateActiveGoal(localRecords)
  })


  const updateTodaysWordCount = (newValue: number) => {
    const sanitisedValue = isNaN(newValue) ? 0 : newValue
    setLocalRecords(updateRecordsUtil(challengeDay,sanitisedValue,localRecords, false) )
  }

    const updateCumulativeWordCount = (newValue: number) => {
    const sanitisedValue = isNaN(newValue) ? 0 : newValue
    setLocalRecords(updateRecordsUtil(challengeDay,sanitisedValue,localRecords, true) )
  }

  return (
    <>
    <button onClick={()=> setIsOpen(true)} className={navbarStyles.responsiveButton}><FontAwesomeIcon icon={faPencil}/>Quick Update</button>
        {isOpen && (
            <>
      <div className={classNames['modal']}>
        <CumulativeSwitch isCumulative={isCumulative} setIsCumulative={setIsCumulative}/>
        <form className={formStyles.form} onSubmit={handleSubmit(onClick)}>
            <LeftRow>
         {isCumulative ?  (<><label id='total'>Total:</label>
        <input aria-labelledby="total" onChange={(event) => {updateCumulativeWordCount(event.target.valueAsNumber)}} value={_.sum(localRecords.slice(0, challengeDay +1))} type="number" disabled={!isCumulative}></input></>)
        : <><label id='today'>Today:</label>
        <input aria-labelledby="today" onChange={(event) => {updateTodaysWordCount(event.target.valueAsNumber)}} value={localRecords[challengeDay] || ''} type="number" disabled={isCumulative}></input>
        </>}     
        </LeftRow>
        
        <BasicButton isLoading={isLoading}>Save</BasicButton>
        </form>
      </div>

      <div className={classNames['modal-overlay']} /></>)}
    </>)
  
}
