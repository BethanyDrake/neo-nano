import { mockQueryFunction } from '@/tests/utils/mockQueryFunction'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { getThreadReactions } from './getThreadReactions'
import { vi } from 'vitest'
vi.mock('../_utils/getQueryFunction')

describe('getThreadReactions', () => {
  test('blah', async () => {
    mockQueryFunction(vi.mocked(getQueryFunction), {
      comment_reactions: [
        { comment_id: '50', reaction: 'like', reacted_users: [16, 17] },
        { comment_id: '12', reaction: 'like', reacted_users: [16] },
      ],
    })

    expect((await getThreadReactions('666'))['50']).toEqual({
      like: ['16', '17'],
    })

      expect((await getThreadReactions('666'))['12']).toEqual({
      like: ['16'],
    })
  })
})
