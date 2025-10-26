import { differenceInCalendarDays, addDays } from 'date-fns'
import { useCallback, useMemo, useRef, useState } from 'react'
import Calendar, { TileContentFunc } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { BasicButton } from '../buttons/BasicButton'
import { Column } from '../layout'
import './UpdateWordCount.css'
import { changeAtIndex, toCumulative } from './recordUtils'
import { Goal, Record } from '../forum.types'
import { updateGoalProgress } from '../serverFunctions/goals/updateGoalProgress'

const isSameDay = (a: Date, b: Date) => {
  return differenceInCalendarDays(a, b) === 0
}

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

export const UpdateWordCount = ({
  records,
  setRecords,
  isCumulative,
  startDate,
  lengthDays,
  id,
}: {
  setRecords: (newRecords: Record[]) => void
  isCumulative: boolean
} & Pick<Goal, 'id' | 'records' | 'startDate' | 'lengthDays'>) => {
  const [value, onChange] = useState<Value>(new Date())
  const calendarRef = useRef(null)
  const cumulativeRecords = useMemo(() => {
    return toCumulative(records)
  }, [records])

  const [isLoading, setIsLoading] = useState(false)

  const _updateGoalProgress = useCallback(
    async (newRecords: Record[]) => {
      setIsLoading(true)
      const {claimedAwards} = await updateGoalProgress({ id, records: newRecords })
      if (claimedAwards.length > 0) {
        console.log("claimed award!")
      }
      setIsLoading(false)
    },
    [id],
  )

  const updateRecord = useCallback(
    (day: number, newValue: number) => {
      const sanitisedValue = isNaN(newValue) ? 0 : newValue
      let newRecords
      if (isCumulative) {
        const difference = day === 0 ? sanitisedValue : sanitisedValue - (cumulativeRecords[day - 1] ?? 0)
        newRecords = changeAtIndex(records, day, difference)
      } else {
        newRecords = changeAtIndex(records, day, sanitisedValue)
      }
      if (newRecords[day] !== records[day]) {
        setRecords(newRecords)
        _updateGoalProgress(newRecords)
      }
    },
    [_updateGoalProgress, cumulativeRecords, isCumulative, records, setRecords],
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
              name={`wordcount for ${date}${isCumulative ? ' (cumulative)' : ''}`}
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
      <BasicButton
        isLoading={isLoading}
        buttonProps={{ onClick: () => _updateGoalProgress(records), style: { width: '100%' } }}
      >
        Save
      </BasicButton>
    </Column>
  )
}
