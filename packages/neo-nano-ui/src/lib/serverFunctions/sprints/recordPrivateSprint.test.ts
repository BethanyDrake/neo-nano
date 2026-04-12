// @vitest-environment node

import { addUser } from '@/tests/utils/fillDb'
import { cancelPrivateSprint, completePrivateSprint, createPrivateSprint, getMySprintLog } from './recordPrivateSprint'
import { getUserId } from '../_utils/getUserIdFromSession'

vi.mock('../_utils/getUserIdFromSession')

describe('recordPrivateSprint', () => {
  test('create and cancel a private sprint', async () => {
    const userId = await addUser()
    vi.mocked(getUserId).mockResolvedValue(userId)
    const sprint = await createPrivateSprint(new Date(), 100)
    await cancelPrivateSprint(sprint.id)
    const mySprintLog = await getMySprintLog()
    expect(mySprintLog).toHaveLength(0)
  })
  test('create and complete a private sprint', async () => {
    const userId = await addUser()
    vi.mocked(getUserId).mockResolvedValue(userId)
    const sprint = await createPrivateSprint(new Date(), 100)
    await completePrivateSprint(sprint.id, 120, 20)
    const mySprintLog = await getMySprintLog()
    expect(mySprintLog).toHaveLength(1)
    expect(mySprintLog[0]).toEqual(
      expect.objectContaining({
        durationSeconds: 120,
        participationState: 'completed',
        userId,
        visibility: 'private',
        wordCount: 20,
      }),
    )
  })
})
