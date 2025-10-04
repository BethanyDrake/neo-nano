import { differenceInCalendarDays } from 'date-fns'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import Calendar, { TileContentFunc } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { BasicButton } from '../buttons/BasicButton'
import { Column, Row } from '../layout'
import './UpdateWordCount.css'

const isSameDay = (a: Date, b: Date) => {
  return differenceInCalendarDays(a, b) === 0
}

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

const startDate = new Date('2025-11-01')
export const UpdateWordCount = ({
  records,
  setRecords,
  onSave,
  onCancel,
}: {
  records: number[]
  setRecords: Dispatch<SetStateAction<number[]>>
  onSave: () => void
  onCancel: () => void
}) => {
  const [value, onChange] = useState<Value>(startDate)

  const updateRecord = useCallback(
    (day: number, newValue: number) => {
      if (isNaN(newValue)) return
      setRecords((previousRecords) => {
        const head = previousRecords.slice(0, day)
        const tail = previousRecords.slice(day + 1)
        const newRecords = [...head, newValue, ...tail]
        return newRecords
      })
    },
    [setRecords],
  )

  const renderTile = useCallback<TileContentFunc>(
    ({ date, view }) => {
      if (view !== 'month' || !(value instanceof Date)) return
      const isSelected = isSameDay(date, value)
      const challengeDay = differenceInCalendarDays(date, startDate)

      const onSubmit = ({ target }: { target: EventTarget & HTMLInputElement }) =>
        updateRecord(challengeDay, target.valueAsNumber)

      if (view === 'month') {
        if (isSelected) {
          return (
            <input
              autoFocus
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

        return <div>{records[challengeDay]}</div>
      }
    },
    [value, records, updateRecord],
  )

  return (
    <Column>
      <Calendar
        tileContent={renderTile}
        minDate={new Date('2025-11-01')}
        maxDate={new Date('2025-11-30')}
        onChange={onChange}
        value={value}
      />
      <Row>
        <BasicButton buttonProps={{ onClick: onSave, style: { width: '50%' } }}>Save</BasicButton>
        <BasicButton buttonProps={{ onClick: onCancel, style: { width: '50%' } }}>Cancel</BasicButton>
      </Row>
    </Column>
  )
}
