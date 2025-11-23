import { percentilePerDay } from '@/lib/analytics/percentilePerDay'
import { getQueryFunction } from '../_utils/getQueryFunction'

export const getSummaryData = async () => {
  console.log('getSummaryData')

  const userRecords = await getQueryFunction()`SELECT user_id, records
  from goals
  where start_date='2025-11-01' and length_days=30 limit 20` as  {user_id: string, records: (number | null)[]}[]

  const records = userRecords.map(({records}) => records).filter((records) => records.length === 30)


  const d50 = percentilePerDay(records, 50)
  const d75 = percentilePerDay(records, 75)
  const d90 = percentilePerDay(records, 90)

  console.log({
    d50, d75, d90
  })

  return {
    d50, d75, d90
  }
}
