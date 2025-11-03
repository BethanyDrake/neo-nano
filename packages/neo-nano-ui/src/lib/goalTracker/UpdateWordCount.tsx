import { addDays, differenceInCalendarDays } from 'date-fns'
import { useCallback, useContext, useMemo, useRef, useState } from 'react'
import Calendar, { TileContentFunc } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { NewAwardModalContext } from '../awards/NewAwardModal'
import { BasicButton } from '../buttons/BasicButton'
import { useProfileContext } from '../context/ProfileContext'
import { Goal, Record } from '../forum.types'
import { Column } from '../layout'
import { updateGoalProgress } from '../serverFunctions/goals/updateGoalProgress'
import './UpdateWordCount.css'
import { toCumulative } from './recordUtils'
import { updateRecordsUtil } from './updateRecordsUtil'

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

   const {displayNewAward} = useContext(NewAwardModalContext)
  const {refreshAwards} = useProfileContext()
  const [isLoading, setIsLoading] = useState(false)

  const _updateGoalProgress = useCallback(
    async (newRecords: Record[]) => {
      setIsLoading(true)
      const {claimedAwards} = await updateGoalProgress({ id, records: newRecords })
      if (claimedAwards.length > 0) {
        refreshAwards()
        displayNewAward(claimedAwards[0])
      }
      setIsLoading(false)
    },
    [displayNewAward, id, refreshAwards],
  )

  const updateRecord = useCallback(
    (day: number, newValue: number) => {
      const sanitisedValue = isNaN(newValue) ? 0 : newValue
      const newRecords = updateRecordsUtil(day, sanitisedValue, records, isCumulative )
      if (newRecords[day] !== records[day]) {
        setRecords(newRecords)
        _updateGoalProgress(newRecords)
      }
    },
    [_updateGoalProgress, isCumulative, records, setRecords],
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
