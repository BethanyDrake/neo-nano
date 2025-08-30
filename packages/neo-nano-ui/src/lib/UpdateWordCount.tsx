import { isEqual } from 'date-fns'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import Calendar, { TileContentFunc } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import { differenceInCalendarDays } from 'date-fns'

const isSameDay = (a: Date, b: Date) => {
  return differenceInCalendarDays(a, b) === 0
}

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

    const startDate = new Date('2025-11-01')
export const UpdateWordCount = ({records, setRecords}: {records: number[], setRecords: Dispatch<SetStateAction<number[]>>}) => {

  const [value, onChange] = useState<Value>(startDate)
  console.log({records})



  const updateRecord = useCallback((day, newValue) => {
    console.log(day, newValue)
    if (isNaN(newValue)) return
    setRecords((previousRecords) => {
        
        const head = previousRecords.slice(0, day)
        const tail =  previousRecords.slice(day+1)
        console.log()
        const newRecords = [...head, newValue, ...tail]
        console.log(newRecords)
        return newRecords
    })
  }, [setRecords])

  const renderTile = useCallback<TileContentFunc>(
    ({ date, view }) => {
        if (view !== 'month' || !(value instanceof Date)) return
      const isSelected =  isSameDay(date, value)
      const challengeDay = differenceInCalendarDays(date, startDate)
      console.log({challengeDay}, records[challengeDay])

      if (view === 'month') {
        // Check if a date React-Calendar wants to check is on the list of dates to add class to
        if (isSelected) {
          return <input autoFocus onBlur={({target}) => updateRecord(challengeDay, target.valueAsNumber)} type="number"></input>
        }

        return( <div>{records[challengeDay]}</div>)
      }
    },
    [value, records, updateRecord],
  )

  return (
    <div>
      <Calendar
        tileContent={renderTile}
        minDate={new Date('2025-11-01')}
        maxDate={new Date('2025-11-30')}
        onChange={onChange}
        value={value}
      />
    </div>
  )
}
