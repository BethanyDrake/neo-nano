import { clearDb } from '@/tests/utils/clearDb'
import { addCategory, addTopic, addUser, GENERAL_TOPIC } from '@/tests/utils/fillDb'
import { createThread, CreateThreadPayload } from '../forum/createThread'
import { addThreadComment } from '../forum/addThreadComment'
import { ThreadSummary } from '../forum/getThreads'
import { getUserId } from '../_utils/getUserIdFromSession'
import { flagComment } from './flagComment'
import { getFlaggedComments } from './getFlaggedComments'
import { getIsModerator } from './getIsModerator'
import { confirmFlag, refuteFlag } from './reviewFlaggedComment'
import { getComment } from '../forum/getComment'
vi.mock('../_utils/getUserIdFromSession')
vi.mock('./getIsModerator')

const buildCreateThreadPayload = (): CreateThreadPayload => {
  return { title: '', commentRichText: '', commentText: '', topic: GENERAL_TOPIC }
}
describe('updateReviewStatus', () => {
  let createdThread: ThreadSummary
  beforeEach(async () => {
    await clearDb()
    await addCategory()
    await addTopic()
    const authorId = await addUser({ displayName: 'Author Name' })
    vi.mocked(getUserId).mockResolvedValue(authorId)
    createdThread = (await createThread(buildCreateThreadPayload())).threadSummaries[0]
  })
  test('a comment with no flags has null removal status', async () => {
    const comment = await addThreadComment(createdThread.id, 'Some text', 'Some rich text')
    // await updateReviewStatus(comment.id)
    const updatedComment = await getComment(comment.id)
    expect(updatedComment.reviewStatus).toEqual(null)
   
  })


   test('a flagged comment has a pending reviw status', async () => {
    const comment = await addThreadComment(createdThread.id, 'Some text', 'Some rich text')
    await flagComment({comment: comment.id, reason: 'other', details: ''})
    const updatedComment = await getComment(comment.id)
    expect(updatedComment.reviewStatus).toEqual('pending_review')
  })

  test('confirmed inapproprate comment', async () => {
    const comment = await addThreadComment(createdThread.id, 'Some text', 'Some rich text')
    await flagComment({comment: comment.id, reason: 'other', details: ''})
    const flaggedComments = await getFlaggedComments()
        vi.mocked(getIsModerator).mockResolvedValue(true)
    await confirmFlag(flaggedComments.find((commentFlag) => commentFlag.comment.id === comment.id)!.flag.id)
    const updatedComment = await getComment(comment.id)
    
    expect(updatedComment.reviewStatus).toEqual('confirmed_inappropriate')
  })

   test('refuted flag', async () => {
    const comment = await addThreadComment(createdThread.id, 'Some text', 'Some rich text')
    await flagComment({comment: comment.id, reason: 'other', details: ''})
    const flaggedComments = await getFlaggedComments()
        vi.mocked(getIsModerator).mockResolvedValue(true)
    await refuteFlag(flaggedComments.find((commentFlag) => commentFlag.comment.id === comment.id)!.flag.id)
    const updatedComment = await getComment(comment.id)
    
    expect(updatedComment.reviewStatus).toEqual(null)
  })

})
