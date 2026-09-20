import { flagComment } from './flagComment'
import { classifyComment } from './isSpam'

export const autoReviewComment = async (commentId: string, commentText: string) => {
  try {
    const { isInappropriate, confidence, category } = await classifyComment(commentText)
    if (isInappropriate && confidence > 0.9) {
      await flagComment({ comment: commentId, reason: category, details: `Flagged by AI. Confidence: ${confidence}` })
      return true
    }
  } catch (error) {
    console.error(error)
  }

  return false
}
