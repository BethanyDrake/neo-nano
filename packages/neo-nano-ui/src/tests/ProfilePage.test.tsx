import ProfilePage from '@/app/profile/page'
import { auth0 } from '@/lib/auth0'
import { getMyGoals } from '@/lib/serverFunctions/goals/getMyGoals'
import { getMyProfile } from '@/lib/serverFunctions/profile/getMyProfile'
import { SessionData } from '@auth0/nextjs-auth0/types'
import { render } from '@testing-library/react'

jest.mock('@/lib/auth0', () => ({
  auth0: {
    withPageAuthRequired: (fn: () => Promise<React.JSX.Element>) => fn,
    getSession: jest.fn(),
  },
}))
jest.mock('@/lib/useRequireLogin')
jest.mock('next/navigation')
jest.mock('@/lib/goalTracker/UpdateWordCount')
jest.mock('@/lib/serverFunctions/profile/getMyProfile')
jest.mock('@/lib/serverFunctions/goals/getMyGoals')
jest.mock('@/lib/serverFunctions/profile/getMyAwards', () => ({
  getMyAwards: jest.fn().mockResolvedValue([]),
}))

jest.mock('@/lib/serverFunctions/settings/getEmailPreferences', () => ({
  getEmailPreferences: jest.fn().mockResolvedValue({ recieveChallengeReminders: false, revieveEncouragmentEmails: false })
}))
describe('<ProfilePage />', () => {
  it('shows user details and goals', async () => {
    jest.mocked(auth0.getSession).mockResolvedValue('some session data' as unknown as SessionData)
    jest.mocked(getMyProfile).mockResolvedValue({
      displayName: 'Some Name',
      id: '1',
      role: 'user',
    })
    jest.mocked(getMyGoals).mockResolvedValue([
      {
        title: 'Goal Title',
        id: '1',
        records: [],
        userId: '2',
        target: 50000,
        startDate: '2025-11-01',
        lengthDays: 30,
        visibility: 'private',
      },
    ])
    const { findByText } = render(await ProfilePage())
    expect(await findByText('Some Name')).toBeInTheDocument()
    expect(await findByText('Goal Title')).toBeInTheDocument()
  })

  test('invites users without a goal to join the challenge', async () => {
    jest.mocked(auth0.getSession).mockResolvedValue('some session data' as unknown as SessionData)
    jest.mocked(getMyProfile).mockResolvedValue({
      displayName: 'Some Name',
      id: '1',
      role: 'user',
    })
    jest.mocked(getMyGoals).mockResolvedValue([])
    const { findByRole } = render(await ProfilePage())
    expect(await findByRole('button', { name: 'Join Novel November' })).toBeInTheDocument()
  })

  test('moderators have a label on their profile', async () => {
    jest.mocked(auth0.getSession).mockResolvedValue('some session data' as unknown as SessionData)
    jest.mocked(getMyProfile).mockResolvedValue({
      displayName: 'Some Name',
      id: '1',
      role: 'moderator',
    })
    jest.mocked(getMyGoals).mockResolvedValue([])
    const { findByText } = render(await ProfilePage())
    expect(await findByText('Moderator')).toBeInTheDocument()
  })
})
