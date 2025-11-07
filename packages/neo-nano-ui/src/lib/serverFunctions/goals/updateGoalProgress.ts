'use server'
import camelcaseKeys from "camelcase-keys"
import { Goal } from "../../forum.types"
import { getQueryFunction } from "../_utils/getQueryFunction"
import { getUserId } from "../_utils/getUserIdFromSession"
import { getUnclaimedAwards } from "../awards/getUnclaimedAwards"
import { assessConsistencyAward, assessWordCountAward } from "../awards/assessAwards"
import { claimAward } from "../profile/claimAward"
import { UserAward } from "@/lib/profile.types"

export type UpdatedGoalProgressReturn = {
  updatedGoal: Goal,
  claimedAwards: UserAward[]

}

export async function updateGoalProgress(goal: Pick<Goal, 'id' | 'records'>): Promise<UpdatedGoalProgressReturn> {
  const user_id = await getUserId()
  const sql = getQueryFunction()

  const [updatedGoals, unclaimedAwards] = await Promise.all([await sql`UPDATE goals set records=${goal.records}
       where user_id=${user_id}
       and id=${goal.id}
       returning goals.*`, getUnclaimedAwards(user_id)])
  const updatedGoal = camelcaseKeys(updatedGoals[0]) as Goal

  const claimableAwards = unclaimedAwards.filter((award) => assessWordCountAward({award, goal: updatedGoal}) || assessConsistencyAward({award, goal: updatedGoal}))
  const claimedAwards = await Promise.all(claimableAwards.map(({id}) => claimAward(id)))

  return {
    claimedAwards, 
    updatedGoal
  }

}
