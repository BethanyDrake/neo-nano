import { mockRequest } from '@/tests/utils/mswHelpers'
import { getEmailPreferences } from './getEmailPreferences'
import { vi } from 'vitest'
import { setupServer } from 'msw/node'

vi.mock('@/lib/auth0', () => ({
  auth0: {
    getSession: () => Promise.resolve({ user: { email: 'name@example.com' } }),
  },
}))

const server = setupServer()
describe('get email preferences', () => {
  beforeAll(() => {
    server.listen()
  })
  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => server.close())
  test('happy path', async () => {
    mockRequest(server)('get', 'https://api.emailoctopus.com/lists/EMAIL_OCTOPUS_LIST_ID/contacts/a130ced3f36ffd4604f4dae04b2b3bcd', {
      tags: ['challenge_reminders', 'encouragment'],
    })
    expect(await getEmailPreferences()).toEqual({
      recieveChallengeReminders: true,
      revieveEncouragmentEmails: true,
    })
  })

  test('sad path', async () => {
    mockRequest(server)(
      'get',
      'https://api.emailoctopus.com/lists/EMAIL_OCTOPUS_LIST_ID/contacts/a130ced3f36ffd4604f4dae04b2b3bcd',
      undefined,
      404,
    )
    expect(await getEmailPreferences()).toEqual({
      recieveChallengeReminders: false,
      revieveEncouragmentEmails: false,
    })
  })
})
