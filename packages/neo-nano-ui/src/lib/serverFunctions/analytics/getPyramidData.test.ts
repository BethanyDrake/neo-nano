import { getCurrentChallenge, getPreviousChallenge } from '@/lib/challenges'
import { getPyramidData } from './getPyramidData'
import { buildChallenge } from '@/lib/types/challenge.builders'
import { clearDb } from '@/tests/utils/clearDb'
import { addGoal, addUser } from '@/tests/utils/fillDb'
vi.mock('@/lib/challenges')
describe('getPyramidData', () => {
  beforeEach(async () => {
    await clearDb()
  })
  test('fallback state', async () => {
    vi.mocked(getCurrentChallenge).mockReturnValue(undefined)
    vi.mocked(getPreviousChallenge).mockReturnValue(undefined)
    const pyramidData = await getPyramidData()
    expect(pyramidData).toEqual([])
  })

  test('empty november challenge', async () => {
    vi.mocked(getCurrentChallenge).mockReturnValue(
      buildChallenge({
        target: 50000,
        startDate: '2000-11-01',
        lengthDays: 30,
      }),
    )
    const pyramidData = await getPyramidData()
    expect(pyramidData).toEqual([
      {
        milestone: 1000,
        writerCount: 0,
      },
      {
        milestone: 5000,
        writerCount: 0,
      },
      {
        milestone: 10000,
        writerCount: 0,
      },
      {
        milestone: 25000,
        writerCount: 0,
      },
      {
        milestone: 50000,
        writerCount: 0,
      },
    ])
  })

  test('short cahllenge with 3 participants and 1 winner', async () => {
    const [user1, user2, user3] = await Promise.all([addUser(), addUser(), addUser()])
    const startDate = '2000-11-01'
    const lengthDays = 2
    await addGoal(user1, { startDate, lengthDays, records: [1000, null] })
    await addGoal(user2, { startDate, lengthDays, records: [1000, 5000] })
    await addGoal(user3, { startDate, lengthDays, records: [1000, 49000] })

    vi.mocked(getCurrentChallenge).mockReturnValue(
      buildChallenge({
        target: 50000,
        startDate,
        lengthDays,
      }),
    )
    const pyramidData = await getPyramidData()

    expect(pyramidData).toEqual([
      {
        milestone: 1000,
        writerCount: 3,
      },
      {
        milestone: 5000,
        writerCount: 2,
      },
      {
        milestone: 10000,
        writerCount: 1,
      },
      {
        milestone: 25000,
        writerCount: 1,
      },
      {
        milestone: 50000,
        writerCount: 1,
      },
    ])
  })
})
