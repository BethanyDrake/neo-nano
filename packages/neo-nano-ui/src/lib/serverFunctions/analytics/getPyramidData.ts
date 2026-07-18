import { getCurrentChallenge, getPreviousChallenge } from '@/lib/challenges'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { pyramidOfProgressData } from '@/lib/analytics/getPyramidOfProgressData'

const targetMilestones: Record<string, number[]> = {
  15000: [1000, 5000, 10000, 15000],
  50000: [1000, 5000, 10000, 25000, 50000],
  80: [10, 20, 40, 60, 80]
}

export const getPyramidData = async () => {
  console.log('getPyramidData')
  const challenge = getCurrentChallenge() ?? getPreviousChallenge()
  if (!challenge) return []

  const userRecords = await getQueryFunction()`SELECT user_id, records
  from goals
  where start_date=${challenge.startDate} and length_days=${challenge.lengthDays}` as  {user_id: string, records: (number | null)[]}[]

  const milestones = targetMilestones[`${challenge.target}`] ?? []

  const records = userRecords.map(({records}) => records).filter((records) => records.length === challenge.lengthDays)

  return pyramidOfProgressData(records, milestones)

}
