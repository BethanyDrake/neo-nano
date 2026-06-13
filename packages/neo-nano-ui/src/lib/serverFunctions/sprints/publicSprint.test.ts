import { addHours, addMinutes } from 'date-fns'
import {
  completePublicSprint,
  createPublicSprint,
  getMyUpcomingSprints,
  getPastRecentSprints,
  getPublicSprintLog,
  getUpcomingPublicSprints,
  registerForPublicSprint,
} from './publicSprint'
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
      { durationSeconds: 100, id: expect.anything(), startTime: expect.anything(), visibility: 'public' , participants: 0},
    ])
  })

  test('get past recent sprints', async () => {
    await createPublicSprint(addHours(Date.now(), -1), 111)
    await createPublicSprint(addHours(Date.now(), -36), 3636)
    expect(await getPastRecentSprints(12)).toEqual([
      { durationSeconds: 111, id: expect.anything(), startTime: expect.anything(), visibility: 'public', participants: 0 },
    ])
  })

  test('create and register for public sprint', async () => {
    const userId = await addUser({displayName: "Alice"})
    vi.mocked(getUserId).mockResolvedValue(userId)
    const { id } = await createPublicSprint(addMinutes(Date.now(), 5), 100)
    await registerForPublicSprint(id)
    expect(await getPublicSprintLog(id)).toEqual([
      {
        userId,
        wordCount: null,
        displayName: "Alice",
        participationState: 'registered',
      },
    ])

    expect(await getMyUpcomingSprints()).toEqual([
      {
        durationSeconds: 100,
        id,
        startTime: expect.anything(),
        visibility: 'public',
        hasStarted: false,
        endTime: expect.anything(),
      },
    ])

    expect((await getUpcomingPublicSprints())[0].participants).toEqual(1)
  })

  test('complete  public sprint', async () => {
    const userId = await addUser({displayName: "Alice"})
    vi.mocked(getUserId).mockResolvedValue(userId)
    const { id } = await createPublicSprint(addMinutes(Date.now(), 5), 100)
    await registerForPublicSprint(id)
    await completePublicSprint(id, 200)
    const sprintLog = await getPublicSprintLog(id)
    expect(sprintLog).toEqual([{"userId": userId,
   "wordCount": 200,
   
   participationState: 'completed',
  displayName:"Alice" }])

  })

  test('getMyUpcomingSprints', async () => {
  const userA = await addUser({displayName: "Alice"})
  vi.mocked(getUserId).mockResolvedValue(userA)
  const { id } = await createPublicSprint(addMinutes(Date.now(), 5), 100)
  await registerForPublicSprint(id)

  const userB = await addUser({displayName: "Bob"})
  vi.mocked(getUserId).mockResolvedValue(userB)
  await registerForPublicSprint(id)

    expect(await getMyUpcomingSprints()).toEqual([{
    "durationSeconds": 100,
    id,
    "startTime": expect.anything(),
    "visibility": "public",
    hasStarted: false,
    endTime: expect.anything(),

  },])
  })
})
