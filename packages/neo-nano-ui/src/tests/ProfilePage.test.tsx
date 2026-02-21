import ProfilePage from '@/app/profile/page'
import { auth0 } from '@/lib/auth0'
import { getCurrentChallenge } from '@/lib/challenges'
import { getDateAsString } from '@/lib/misc'
import { getMyGoals } from '@/lib/serverFunctions/goals/getMyGoals'
import { joinChallenge } from '@/lib/serverFunctions/goals/joinCurrentChallenge'
import { updateGoalProgress } from '@/lib/serverFunctions/goals/updateGoalProgress'
import { getMyAwards } from '@/lib/serverFunctions/profile/getMyAwards'
import { getMyProfile } from '@/lib/serverFunctions/profile/getMyProfile'
import { getEmailPreferences } from '@/lib/serverFunctions/settings/getEmailPreferences'
import { buildChallenge } from '@/lib/types/challenge.builders'
import { buildGoal } from '@/lib/types/forum.builders'
import { buildUserAward } from '@/lib/types/profile.types'
import { SessionData } from '@auth0/nextjs-auth0/types'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { startOfToday } from 'date-fns'
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'
import { wrap } from 'souvlaki'
import { withReactQueryClient } from './utils/withReactQueryClient'
import { vi } from 'vitest'
import { getMyProjects } from '@/lib/serverFunctions/projects/getMyProjects'
vi.mock('@/lib/serverFunctions/goals/updateGoalProgress')
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn()
}))
vi.mock('@/lib/serverFunctions/moderation/getIsModerator', () => ({getIsModerator: () => Promise.resolve(false)}))
vi.mock( '@/lib/serverFunctions/projects/getMyProjects')
vi.mock('@/lib/auth0', () => ({
  auth0: {
    withPageAuthRequired: (fn: () => Promise<React.JSX.Element>) => fn,
    getSession: vi.fn(),
  },
}))
vi.mock('@/lib/useRequireLogin')
vi.mock('@/lib/serverFunctions/profile/getMyProfile')
vi.mock('@/lib/serverFunctions/goals/getMyGoals')
vi.mock('@/lib/serverFunctions/profile/getMyAwards')
vi.mock('@/lib/serverFunctions/settings/getEmailPreferences')

vi.mock('@/lib/challenges')
vi.mock('@/lib/serverFunctions/goals/joinCurrentChallenge')
describe('<ProfilePage />', () => {
  beforeEach(() => {
    vi.mocked(getMyAwards).mockResolvedValue([])
    vi.mocked(useSearchParams).mockReturnValue({ get: vi.fn() } as unknown as ReadonlyURLSearchParams)
    vi
      .mocked(getEmailPreferences)
      .mockResolvedValue({ recieveChallengeReminders: false, revieveEncouragmentEmails: false })
  })
  it('shows user details and goals', async () => {
    vi.mocked(auth0.getSession).mockResolvedValue('some session data' as unknown as SessionData)
    vi.mocked(getMyProfile).mockResolvedValue({
      displayName: 'Some Name',
      id: '1',
      role: 'user',
    })
    vi.mocked(getMyGoals).mockResolvedValue([
      {
        title: 'Goal Title',
        id: '1',
        records: [],
        userId: '2',
        target: 50000,
        startDate: '2025-11-01',
        lengthDays: 30,
        visibility: 'private',
        metric: 'words',
      },
    ])
    const { findByText } = render(await ProfilePage(),{wrapper: wrap(withReactQueryClient())})
    expect(await findByText('Some Name'))
    expect(await findByText('Goal Title'))
  })

  test('invites users without a goal to join the current challenge', async () => {
    vi.mocked(auth0.getSession).mockResolvedValue('some session data' as unknown as SessionData)
    vi
      .mocked(getCurrentChallenge)
      .mockReturnValue(buildChallenge({ title: 'Current Challenge', id: 'current-challenge-id' }))
    vi.mocked(getMyProfile).mockResolvedValue({
      displayName: 'Some Name',
      id: '1',
      role: 'user',
    })
    vi.mocked(getMyGoals).mockResolvedValue([])
    vi.mocked(joinChallenge).mockResolvedValue([])
    const { findByRole } = render(await ProfilePage(),{wrapper: wrap(withReactQueryClient())})

    const joinChallengeButton = await findByRole('button', { name: 'Join Current Challenge' })

    fireEvent.click(joinChallengeButton)
    await waitFor(() => {
      expect(joinChallenge).toHaveBeenCalledWith('current-challenge-id')
    })
  })

  test('moderators have a label on their profile', async () => {
    vi.mocked(auth0.getSession).mockResolvedValue('some session data' as unknown as SessionData)
    vi.mocked(getMyProfile).mockResolvedValue({
      displayName: 'Some Name',
      id: '1',
      role: 'moderator',
    })
    vi.mocked(getMyGoals).mockResolvedValue([])
    const { findByText } = render(await ProfilePage(),{wrapper: wrap(withReactQueryClient())})
    expect(await findByText('Moderator'))
  })

  test('update a goal and earn a new award', async () => {
    vi.mocked(auth0.getSession).mockResolvedValue('some session data' as unknown as SessionData)
    vi.mocked(getMyProfile).mockResolvedValue({
      displayName: 'Some Name',
      id: '1',
      role: 'moderator',
    })
    vi
      .mocked(getMyGoals)
      .mockResolvedValue([
        buildGoal({
          records: [null],
          target: 1000,
          title: 'Goal Title',
          lengthDays: 1,
          startDate: getDateAsString(startOfToday()),
        }),
      ])
    vi
      .mocked(updateGoalProgress)
      .mockResolvedValue({ updatedGoal: buildGoal(), claimedAwards: [buildUserAward({ title: 'Some Award', imageUrl: 'http://example' })] })
    const { findByText, getByRole } = render(await ProfilePage(), {wrapper: wrap(withReactQueryClient())})

    expect(await findByText('Goal Title'))
    const input = getByRole('spinbutton', { name: /wordcount for/ })
    fireEvent.change(input, { target: { value: 100 } })
    fireEvent.blur(input)
    expect(await findByText('Some Award'))
  })

  it('shows user projects', async () => {
    vi.mocked(auth0.getSession).mockResolvedValue('some session data' as unknown as SessionData)
    vi.mocked(getMyProfile).mockResolvedValue({
      displayName: 'Some Name',
      id: '1',
      role: 'user',
    })
    vi.mocked(getMyGoals).mockResolvedValue([])
    vi.mocked(getMyProjects).mockResolvedValue([
      {
        id: '1',
        title: 'Project Title',
        userId: '',
        visibility: 'private',
        status: 'planning',
        aspects: {
          romance: 100,
          fantasy: 60,
          mystery: 20,
          thrill: 60,
          complexity: 20
        }
      },
    ])
    const { findByText } = render(await ProfilePage(),{wrapper: wrap(withReactQueryClient())})
    expect(await findByText('Some Name'))
    expect(await findByText('Project Title'))
  })
})
