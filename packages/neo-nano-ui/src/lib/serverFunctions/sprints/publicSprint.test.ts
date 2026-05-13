import { addHours, addMinutes } from 'date-fns'
import { createPublicSprint, getPastRecentSprints, getUpcomingPublicSprints } from './publicSprint'
import { clearDb } from '@/tests/utils/clearDb'

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
      { durationSeconds: 111, id: expect.anything(), startTime: expect.anything(), visibility: 'public' },
    ])
  })
})
