import { vi } from 'vitest'
import { updateEmailPreferences } from './updateEmailPreferences'
import axios from 'axios'
vi.mock('axios')
vi.mock('@/lib/auth0', () => ({
  auth0: {
    getSession: () => Promise.resolve({ user: { email: 'name@example.com' } }),
  },
}))

describe('get email preferences', () => {
  test('happy path', async () => {
    await updateEmailPreferences({
      recieveChallengeReminders: true,
      revieveEncouragmentEmails: true,
    })

    expect(axios.put).toHaveBeenCalledWith(
      'https://api.emailoctopus.com/lists/undefined/contacts',
      {
        email_address: 'name@example.com',
        fields: {},
        tags: {
          challenge_reminders: true,
          encouragment: true,
        },
        status: 'subscribed',
      },
      expect.anything(),
    )
  })
})
