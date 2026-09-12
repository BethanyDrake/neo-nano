import { addUser } from '@/tests/utils/fillDb'
import { getExternalId } from '../_utils/getUserIdFromSession'
import { vi } from 'vitest'
import { clearDb } from '@/tests/utils/clearDb'
import { updateProfile } from './updateProfile'
import { getMyProfile } from './getMyProfile'

vi.mock('../_utils/getUserIdFromSession')

describe('createThread', () => {
  beforeEach(async () => {
    await clearDb()
  })
  test('creats a thread and an initial comment', async () => {
    const authorId = await addUser({ displayName: 'Author Name' }, 'some-external-id')
    vi.mocked(getExternalId).mockResolvedValue('some-external-id')
    updateProfile({aboutMe: 'New about me.', displayName: 'New Name', links: {
        ao3: 'some-id'
    }})

    expect(await getMyProfile()).toEqual({
        displayName: 'New Name',
        aboutMe: 'New about me.',
        role: 'user',
        id: authorId, 
        links: {
            ao3: 'some-id',
            bluesky: null,
            substack: null,
            wattpad: null
        }
    })
  })
})
