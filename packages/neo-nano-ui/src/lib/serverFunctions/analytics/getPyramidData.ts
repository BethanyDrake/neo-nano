import { getQueryFunction } from '../_utils/getQueryFunction'
import { pyramidOfProgressData } from '@/lib/analytics/getPyramidOfProgressData'

export const getPyramidData = async () => {
  console.log('getPyramidData')

  const userRecords = await getQueryFunction()`SELECT user_id, records
  from goals
  where start_date='2026-07-01' and length_days=31` as  {user_id: string, records: (number | null)[]}[]


  const records = userRecords.map(({records}) => records).filter((records) => records.length === 31)
console.log(userRecords)

  return pyramidOfProgressData(records, [1000, 5000, 10000, 15000])

}
