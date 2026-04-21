import { clearDb } from '@/tests/utils/clearDb'
import { addCategory, addTopic, addUser, GENERAL_TOPIC } from '@/tests/utils/fillDb'
import { createThread, CreateThreadPayload } from '../forum/createThread'
import { addThreadComment } from '../forum/addThreadComment'
import { getThreads, ThreadSummary } from '../forum/getThreads'
import { getUserId } from '../_utils/getUserIdFromSession'
import { flagComment } from './flagComment'
import { getFlaggedComments } from './getFlaggedComments'
import { getIsModerator } from './getIsModerator'
import { confirmFlag, refuteFlag } from './reviewFlaggedComment'
import { getThreadWithComments } from '../forum/getThreadWithComments'
vi.mock('../_utils/getUserIdFromSession')
vi.mock('./getIsModerator')

const buildCreateThreadPayload = (): CreateThreadPayload => {
  return { title: '', commentRichText: '', commentText: '', topic: GENERAL_TOPIC }
}
describe('moderation', () => {
  let createdThread: ThreadSummary
  beforeEach(async () => {
    await clearDb()
    await addCategory()
    await addTopic()
    const authorId = await addUser({ displayName: 'Author Name' })
    vi.mocked(getUserId).mockResolvedValue(authorId)
    createdThread = (await createThread(buildCreateThreadPayload())).threadSummaries[0]
  })
  test('flag then confirm a comment', async () => {
    const comment = await addThreadComment(createdThread.id, 'Some text', 'Some rich text')
    await flagComment({ comment: comment.id, reason: 'harrassment', details: 'Some details.' })
    const flaggedComments = await getFlaggedComments()
    expect(flaggedComments[0].comment.id).toEqual(comment.id)
    expect(flaggedComments[0].flag.reviewedBy).toEqual(null)
    expect(flaggedComments[0].flag.reviewOutcome).toEqual(null)

    const mod = await addUser({ displayName: 'Moderator Name', role: 'moderator' })
    vi.mocked(getUserId).mockResolvedValue(mod)
    vi.mocked(getIsModerator).mockResolvedValue(true)

    await confirmFlag(flaggedComments[0].flag.id)

    const updatedFlaggedComments = await getFlaggedComments()
    expect(updatedFlaggedComments[0].comment.id).toEqual(comment.id)
    expect(updatedFlaggedComments[0].flag.reviewedBy).toEqual(mod)
    expect(updatedFlaggedComments[0].flag.reviewOutcome).toEqual('confirmed')
  })

  test('flag then refute a comment', async () => {
    const comment = await addThreadComment(createdThread.id, 'Some text', 'Some rich text')
    await flagComment({ comment: comment.id, reason: 'harrassment', details: 'Some details.' })

    const mod = await addUser({ displayName: 'Moderator Name', role: 'moderator' })
    vi.mocked(getUserId).mockResolvedValue(mod)
    vi.mocked(getIsModerator).mockResolvedValue(true)
    await refuteFlag((await getFlaggedComments())[0].flag.id)

    const updatedFlaggedComments = await getFlaggedComments()
    expect(updatedFlaggedComments[0].comment.id).toEqual(comment.id)
    expect(updatedFlaggedComments[0].flag.reviewedBy).toEqual(mod)
    expect(updatedFlaggedComments[0].flag.reviewOutcome).toEqual('overruled')
  })

  test('flag the initial comment of a thread', async () => {
    const initialCommentId = (await getThreadWithComments(createdThread.id)).commentCardDataEntries[0].comment.id
    await flagComment({ comment: initialCommentId, reason: 'harrassment', details: 'Some details.' })
    const threadSummary = (await getThreads(GENERAL_TOPIC)).threadSummaries[0]
    expect(threadSummary.removalStatus).toEqual('PENDING_REVIEW')
  })
})
