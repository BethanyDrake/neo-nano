import { clearDb } from '@/tests/utils/clearDb'
import { addCategory, addComment, addThread, addTopic, addUser } from '@/tests/utils/fillDb'
import { flagComment } from './flagComment'
import { getUserId } from '../_utils/getUserIdFromSession'
import { confirmFlag, refuteFlag } from './reviewFlaggedComment'
import { getFlaggedComments } from './getFlaggedComments'
import { getIsModerator } from './getIsModerator'
// @vitest-environment node

vi.mock('../_utils/getUserIdFromSession')
vi.mock('./getIsModerator')
describe('reviewFlaggedComment', () => {
  beforeEach(async () => {
    await clearDb()
    await addCategory()
    await addTopic()
  })

  test('flag then refute a comment', async () => {
    const user = await addUser()
    vi.mocked(getUserId).mockResolvedValue(user)
    const threadId = await addThread()
    const commentId = await addComment(threadId, { text: 'Some comment' })
    await flagComment({ comment: commentId, reason: 'harrassment', details: 'some details' })
    const flags = await getFlaggedComments()

    const mod = await addUser({ role: 'moderator' })
    vi.mocked(getIsModerator).mockResolvedValue(true)
    vi.mocked(getUserId).mockResolvedValue(mod)
    await refuteFlag(flags[0].flag.id)

    const updatedFlags = await getFlaggedComments()
    expect(updatedFlags[0].flag.reviewOutcome).toEqual('overruled')
    expect(updatedFlags[0].flag.reviewedBy).toEqual(mod)
  })

  test('flag then sustain a comment', async () => {
    const user = await addUser()
    vi.mocked(getUserId).mockResolvedValue(user)
    const threadId = await addThread()
    const commentId = await addComment(threadId, { text: 'Some comment' })
    await flagComment({ comment: commentId, reason: 'harrassment', details: 'some details' })
    const flags = await getFlaggedComments()

    const mod = await addUser({ role: 'moderator' })
    vi.mocked(getIsModerator).mockResolvedValue(true)
    vi.mocked(getUserId).mockResolvedValue(mod)
    await confirmFlag(flags[0].flag.id)

    const updatedFlags = await getFlaggedComments()
    expect(updatedFlags[0].flag.reviewOutcome).toEqual('confirmed')
    expect(updatedFlags[0].flag.reviewedBy).toEqual(mod)
  })
})
