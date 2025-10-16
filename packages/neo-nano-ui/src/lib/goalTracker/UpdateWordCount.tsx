import { differenceInCalendarDays, addDays } from 'date-fns'
import { useCallback, useMemo, useRef, useState } from 'react'
import Calendar, { TileContentFunc } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { BasicButton } from '../buttons/BasicButton'
import { Column, Row } from '../layout'
import './UpdateWordCount.css'
import { changeAtIndex, toCumulative } from './recordUtils'
import { Goal, Record } from '../forum.types'

const isSameDay = (a: Date, b: Date) => {
  return differenceInCalendarDays(a, b) === 0
}

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

export const UpdateWordCount = ({
  records,
  setRecords,
  onSave,
  onCancel,
  isCumulative,
  startDate,
  lengthDays
}: {
  setRecords: (newRecords: Record[]) => void
  onSave: () => void
  onCancel: () => void
  isCumulative: boolean
  }
 & Pick<Goal, 'records' | 'startDate' | 'lengthDays'>) => {
  const [value, onChange] = useState<Value>(new Date())
  const calendarRef = useRef(null)
  const cumulativeRecords = useMemo(() => {
    return toCumulative(records)
  }, [records])

  const updateRecord = useCallback(
    (day: number, newValue: number) => {
      if (isNaN(newValue)) return
      if (isCumulative) {
        const difference = day === 0 ? newValue : newValue - (cumulativeRecords[day - 1] ?? 0)
        setRecords(changeAtIndex(records, day, difference))
      } else {
        setRecords(changeAtIndex(records, day, newValue))
      }
    },
    [cumulativeRecords, isCumulative, records, setRecords],
  )

  const renderTile = useCallback<TileContentFunc>(
    ({ date, view }) => {
      if (view !== 'month' || !(value instanceof Date)) return
      const isSelected = isSameDay(date, value)
      const challengeDay = differenceInCalendarDays(date, startDate)
      

      const onSubmit = ({ target }: { target: EventTarget & HTMLInputElement }) => {
        updateRecord(challengeDay, target.valueAsNumber)
      }

      const wordCount = isCumulative ? cumulativeRecords[challengeDay] : records[challengeDay]

      if (view === 'month') {
        if (isSelected) {
          return (
            <input
              autoFocus
              defaultValue={wordCount ?? undefined}
              name={`wordcount for ${date}${isCumulative? ' (cumulative)': ''}`}
              onBlur={onSubmit}
              onKeyDown={({ target, key }) => {
                if (key === 'Enter') {
                  ;(target as HTMLElement).blur()
                }
              }}
              type="number"
            ></input>
          )
        }

        return <div>{wordCount}</div>
      }
    },
    [value, startDate, isCumulative, cumulativeRecords, records, updateRecord],
  )

  return (
    <Column>
      <Calendar
        tileContent={renderTile}
        minDate={new Date(startDate)}
        maxDate={addDays(new Date(startDate), lengthDays)}
        onChange={onChange}
        value={value}
        inputRef={calendarRef}
      />
      <Row>
        <BasicButton buttonProps={{ onClick: onSave, style: { width: '50%' } }}>Save</BasicButton>
        <BasicButton buttonProps={{ onClick: onCancel, style: { width: '50%' } }}>Cancel</BasicButton>
      </Row>
    </Column>
  )
}
