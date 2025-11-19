import { mockRequest } from '@/tests/utils/mswHelpers'
import { getEmailPreferences } from './getEmailPreferences'
jest.mock('@/lib/auth0', () => ({
  auth0: {
    getSession: () => Promise.resolve({ user: { email: 'name@example.com' } }),
  },
}))

describe('get email preferences', () => {
  test('happy path', async () => {
    mockRequest('get', 'https://api.emailoctopus.com/lists/undefined/contacts/a130ced3f36ffd4604f4dae04b2b3bcd', {
      tags: ['challenge_reminders', 'encouragment'],
    })
    expect(await getEmailPreferences()).toEqual({
      recieveChallengeReminders: true,
      revieveEncouragmentEmails: true,
    })
  })

    test('sad path', async () => {
    mockRequest('get', 'https://api.emailoctopus.com/lists/undefined/contacts/a130ced3f36ffd4604f4dae04b2b3bcd', undefined, 404)
    expect(await getEmailPreferences()).toEqual({
      recieveChallengeReminders: false,
      revieveEncouragmentEmails: false,
    })
  })
})
