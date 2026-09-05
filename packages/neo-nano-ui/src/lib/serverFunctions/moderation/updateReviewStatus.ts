'use server'

import { RawFlag } from '../forum/rowMappers'
import { getQueryFunction } from '../_utils/getQueryFunction'

const getNewReviewStatus = (flags: Pick<RawFlag, 'review_outcome'>[]) => {
  const reviewOutcomes = flags.map(({ review_outcome }) => review_outcome)
  if (reviewOutcomes.some((value) => value === 'confirmed')) {
    return 'confirmed_inappropriate'
  }
  if (reviewOutcomes.some((value) => value === null)) {
    return 'pending_review'
  }
  return null
}

export const updateReviewStatus = async (commentId: string) => {
  const flags = (await getQueryFunction()`select review_outcome from flags where flags.comment=${commentId}`) as Pick<
    RawFlag,
    'review_outcome'
  >[]
  const newReviewStatus = getNewReviewStatus(flags)

  const results = await getQueryFunction()`UPDATE comments
    SET review_status = ${newReviewStatus}
    where comments.id=${commentId}
    returning comments.*
    `
  if (results.length !== 1) {
    throw Error(`Failed to update comment`)
  }
}
