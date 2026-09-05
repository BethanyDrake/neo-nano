import { RemovalSatus } from "@/lib/types/forum.types"
import { RawComment } from "../forum/rowMappers"

export const getRemovalStatus = (reviewStatus: RawComment['review_status'], isDeleted: boolean): RemovalSatus => {
  if (reviewStatus === 'confirmed_inappropriate') {
    return "REMOVED_INAPPROPRIATE"
  }
   if (reviewStatus === 'pending_review') {
    return "PENDING_REVIEW"
  }
   
  if (isDeleted) return "DELETED"
  return null
}