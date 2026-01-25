import ProfilePage from '@/app/profile/page'
import { auth0 } from '@/lib/auth0'
import { getCurrentChallenge } from '@/lib/challenges'
import { getMyGoals } from '@/lib/serverFunctions/goals/getMyGoals'
import { joinChallenge } from '@/lib/serverFunctions/goals/joinCurrentChallenge'
import { getMyAwards } from '@/lib/serverFunctions/profile/getMyAwards'
import { getMyProfile } from '@/lib/serverFunctions/profile/getMyProfile'
import { getEmailPreferences } from '@/lib/serverFunctions/settings/getEmailPreferences'
import { buildChallenge } from '@/lib/types/challenge.builders'
import { SessionData } from '@auth0/nextjs-auth0/types'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn()
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
jest.mock('@/lib/serverFunctions/profile/getMyAwards')
jest.mock('@/lib/serverFunctions/settings/getEmailPreferences')

jest.mock('@/lib/challenges')
jest.mock('@/lib/serverFunctions/goals/joinCurrentChallenge')
describe('<ProfilePage />', () => {

  beforeEach(() => {
    jest.mocked(getMyAwards).mockResolvedValue([])
    jest.mocked(useSearchParams).mockReturnValue({get: jest.fn()} as unknown as ReadonlyURLSearchParams ) 
    jest.mocked(getEmailPreferences).mockResolvedValue({ recieveChallengeReminders: false, revieveEncouragmentEmails: false })
  })
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
