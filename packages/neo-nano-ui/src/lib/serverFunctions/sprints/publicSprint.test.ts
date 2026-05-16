import { addHours, addMinutes } from 'date-fns'
import { createPublicSprint, getPastRecentSprints, getPublicSprintLog, getUpcomingPublicSprints, registerForPublicSprint } from './publicSprint'
import { clearDb } from '@/tests/utils/clearDb'
import { addUser } from '@/tests/utils/fillDb'
import { getUserId } from '../_utils/getUserIdFromSession'
vi.mock('../_utils/getUserIdFromSession')

describe('public sprints', () => {
  beforeEach(async () => {
    await clearDb()
  })
  test('create public sprint', async () => {
    await createPublicSprint(addMinutes(Date.now(), 5), 100)
    expect(await getUpcomingPublicSprints()).toEqual([
      { durationSeconds: 100, id: expect.anything(), startTime: expect.anything(), visibility: 'public' },
    ])
  })

  test('get past recent sprints', async () => {
    await createPublicSprint(addHours(Date.now(), -1), 111)
    await createPublicSprint(addHours(Date.now(), -36), 3636)
    expect(await getPastRecentSprints(12)).toEqual([
      { durationSeconds: 111, id: expect.anything(), startTime: expect.anything(), visibility: 'public'},
    ])
  })

  test('create and register for public sprint', async () => {
    const userId = await addUser()
    vi.mocked(getUserId).mockResolvedValue(userId)
    const {id} = await createPublicSprint(addMinutes(Date.now(), 5), 100)
    await registerForPublicSprint(id)
    expect(await getPublicSprintLog(id)).toEqual([{
      participationState: "registered",
      userId,
      wordCount: null
    }])
  })
})
