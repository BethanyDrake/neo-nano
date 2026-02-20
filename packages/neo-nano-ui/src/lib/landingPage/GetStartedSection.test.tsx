import { act, render } from '@testing-library/react'
import { GetStartedSection } from './GetStartedSection'
import { useHasActiveOrUpcomingGoal } from '@/lib/hooks/useHasActiveOrUpcomingGoal'
import { getCurrentChallenge } from '../challenges'
import { buildChallenge } from '../types/challenge.builders'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import { vi } from 'vitest'
vi.mock('@auth0/nextjs-auth0')
vi.mock('@/lib/challenges')
vi.mock('@/lib/hooks/useHasActiveOrUpcomingGoal')
vi.mock('@/lib/hooks/useIsLoggedIn')
describe('<GetStartedSection />', () => {
  test('loading state', async () => {
    vi.mocked(useHasActiveOrUpcomingGoal).mockReturnValue({ isLoading: true, hasActiveOrUpcomingGoal: undefined })
    const { getByText } = await act(async () => render(<GetStartedSection />))
    expect(getByText('Get Started'))
  })

  test('logged in - no active or upcoming goals', async () => {
    vi.mocked(getCurrentChallenge).mockReturnValue(buildChallenge({ title: 'Current Challenge' }))
    vi.mocked(useIsLoggedIn).mockReturnValue(true)
    vi.mocked(useHasActiveOrUpcomingGoal).mockReturnValue({ isLoading: false, hasActiveOrUpcomingGoal: false })
    const { getByText, getByRole } = await act(async () => render(<GetStartedSection />))
    expect(getByText('Get Started'))
    expect(getByRole('button', { name: 'Browse Forum' }))
    expect(getByRole('button', { name: 'Join Current Challenge' }))
  })

  test('logged in - already joined challenge', async () => {
    vi.mocked(useIsLoggedIn).mockReturnValue(true)
    vi.mocked(useHasActiveOrUpcomingGoal).mockReturnValue({ isLoading: false, hasActiveOrUpcomingGoal: true })
    const { getByText, getByRole } = await act(async () => render(<GetStartedSection />))
    expect(getByText(/Welcome back/i))
    expect(getByRole('button', { name: 'Browse Forum' }))
    expect(getByRole('button', { name: 'Update Progress' }))
  })

  test('logged out', async () => {
    vi.mocked(useIsLoggedIn).mockReturnValue(false)
    vi.mocked(useHasActiveOrUpcomingGoal).mockReturnValue({ isLoading: false, hasActiveOrUpcomingGoal: undefined })
    const { getByText, getByRole } = await act(async () => render(<GetStartedSection />))
    expect(getByText('Get Started'))
    expect(getByRole('button', { name: 'Sign up' }))
    expect(getByRole('button', { name: 'Log in' }))
    expect(getByRole('link', { name: 'Browse forums as guest' }))
  })
})
