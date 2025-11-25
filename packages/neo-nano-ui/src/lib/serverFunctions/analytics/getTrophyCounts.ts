import { Award } from '@/lib/types/profile.types'
import { getQueryFunction } from '../_utils/getQueryFunction'
import camelcaseKeys from 'camelcase-keys'

export const getTrophyCounts = async () => {
  console.log('getUnclaimedAwards')

  const awardCounts = await getQueryFunction()`SELECT count(awarded_to) as count, awards.* 
  FROM user_awards JOIN awards ON user_awards.award=awards.id
  GROUP BY awards.id`

  return awardCounts.map((award) => camelcaseKeys(award) as Award & { count: number })
}
