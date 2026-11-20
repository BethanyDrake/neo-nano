import { Award } from '@/lib/types/profile.types'
import { getQueryFunction } from '../_utils/getQueryFunction'
import camelcaseKeys from 'camelcase-keys'
import { getCurrentChallenge, getPreviousChallenge } from '@/lib/challenges'

export type TrophyCounts = Award & { count: number }

export const getTrophyCounts = async (): Promise<TrophyCounts[]> => {
  console.log('getTrophyCounts')
  const challenge = getCurrentChallenge() ?? getPreviousChallenge()
  if (!challenge) {return []}
  const awardCounts = await getQueryFunction()`SELECT count(awarded_to) as count, awards.* 
  FROM user_awards JOIN awards ON user_awards.award=awards.id
  WHERE awarded_at>${challenge.startDate}  
  GROUP BY awards.id`

  return awardCounts.map((award) => camelcaseKeys(award) as TrophyCounts)
}
