import { Flag, RemovalSatus } from "@/lib/types/forum.types"

export const getRemovalStatus = (reviewOutcomes: Flag['reviewOutcome'][], isDeleted: boolean): RemovalSatus => {
  if (reviewOutcomes.some((value) => value === 'confirmed')) {
    return "REMOVED_INAPPROPRIATE"
  }
  if (reviewOutcomes.some((value) => value === null)) {
    return "PENDING_REVIEW"
  }
   
  if (isDeleted) return "DELETED"
  return null
}