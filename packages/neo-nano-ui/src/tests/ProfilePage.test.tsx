import ProfilePage from '@/app/profile/page'
import { auth0 } from '@/lib/auth0'
import { getCurrentChallenge } from '@/lib/challenges'
import { getMyGoals } from '@/lib/serverFunctions/goals/getMyGoals'
import { joinChallenge } from '@/lib/serverFunctions/goals/joinCurrentChallenge'
import { getMyProfile } from '@/lib/serverFunctions/profile/getMyProfile'
import { buildChallenge } from '@/lib/types/challenge.builders'
import { SessionData } from '@auth0/nextjs-auth0/types'
import { fireEvent, render, waitFor } from '@testing-library/react'
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn().mockReturnValue({get: () => undefined})
}))

jest.mock('@/lib/auth0', () => ({
  auth0: {
    withPageAuthRequired: (fn: () => Promise<React.JSX.Element>) => fn,
    getSession: jest.fn(),
  },
}))
jest.mock('@/lib/useRequireLogin')
jest.mock('@/lib/goalTracker/UpdateWordCount')
jest.mock('@/lib/serverFunctions/profile/getMyProfile')
jest.mock('@/lib/serverFunctions/goals/getMyGoals')
jest.mock('@/lib/serverFunctions/profile/getMyAwards', () => ({
  getMyAwards: jest.fn().mockResolvedValue([]),
}))

jest.mock('@/lib/serverFunctions/settings/getEmailPreferences', () => ({
  getEmailPreferences: jest.fn().mockResolvedValue({ recieveChallengeReminders: false, revieveEncouragmentEmails: false })
}))

jest.mock('@/lib/challenges')
jest.mock('@/lib/serverFunctions/goals/joinCurrentChallenge')
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
        metric: 'words'
      },
    ])
    const { findByText } = render(await ProfilePage())
    expect(await findByText('Some Name')).toBeInTheDocument()
    expect(await findByText('Goal Title')).toBeInTheDocument()
  })

  test('invites users without a goal to join the current challenge', async () => {
    jest.mocked(auth0.getSession).mockResolvedValue('some session data' as unknown as SessionData)
    jest.mocked(getCurrentChallenge).mockReturnValue(buildChallenge({title: 'Current Challenge', id: 'current-challenge-id'}))
    jest.mocked(getMyProfile).mockResolvedValue({
      displayName: 'Some Name',
      id: '1',
      role: 'user',
    })
    jest.mocked(getMyGoals).mockResolvedValue([])
    jest.mocked(joinChallenge).mockResolvedValue([])
    const { findByRole } = render(await ProfilePage())

    const joinChallengeButton = await findByRole('button', { name: 'Join Current Challenge' })
   
    fireEvent.click(joinChallengeButton)
    await waitFor(() => {
      expect(joinChallenge).toHaveBeenCalledWith('current-challenge-id')
    })
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
