import {  act, render} from '@testing-library/react'
import { GetStartedSection } from './GetStartedSection'

import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn'
import { useHasActiveOrUpcomingGoal } from '@/lib/hooks/useHasActiveOrUpcomingGoal'
import { getCurrentChallenge } from '../challenges'
import { buildChallenge } from '../types/challenge.builders'

jest.mock('@/lib/hooks/useIsLoggedIn')
jest.mock('@/lib/challenges')
jest.mock('@/lib/hooks/useHasActiveOrUpcomingGoal')
describe('<GetStartedSection />', () => {

  test('loading state', async () => {
    jest.mocked(useIsLoggedIn).mockReturnValue({ isLoading: true, isLoggedIn: false })
    jest.mocked(useHasActiveOrUpcomingGoal).mockReturnValue({ isLoading: true, hasActiveOrUpcomingGoal: undefined })
    const { getByText } = await act(async () => render(<GetStartedSection />))
    expect(getByText('Get Started')).toBeInTheDocument()
  })

  test('logged in - no active or upcoming goals', async () => {
    jest.mocked(getCurrentChallenge).mockReturnValue(buildChallenge({title: 'Current Challenge'}))
    jest.mocked(useIsLoggedIn).mockReturnValue({ isLoading: false, isLoggedIn: true })
        jest.mocked(useHasActiveOrUpcomingGoal).mockReturnValue({ isLoading: false, hasActiveOrUpcomingGoal: false })
    const { getByText, getByRole } = await act(async () => render(<GetStartedSection />))
    expect(getByText('Get Started')).toBeInTheDocument()
    expect(getByRole('button', { name: 'Browse Forum' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Join Current Challenge' })).toBeInTheDocument()
  })

    test('logged in - already joined challenge',async ( ) => {
    jest.mocked(useIsLoggedIn).mockReturnValue({ isLoading: false, isLoggedIn: true })
        jest.mocked(useHasActiveOrUpcomingGoal).mockReturnValue({ isLoading: false, hasActiveOrUpcomingGoal: true })
    const { getByText, getByRole } = await act(async () => render(<GetStartedSection />))
    expect(getByText(/Welcome back/i)).toBeInTheDocument()
    expect(getByRole('button', { name: 'Browse Forum' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Update Progress' })).toBeInTheDocument()
  })

  test('logged out', async () => {
    jest.mocked(useIsLoggedIn).mockReturnValue({ isLoading: false, isLoggedIn: false })
    jest.mocked(useHasActiveOrUpcomingGoal).mockReturnValue({ isLoading: false, hasActiveOrUpcomingGoal: undefined })
    const { getByText, getByRole } = await act(async () => render(<GetStartedSection />))
    expect(getByText('Get Started')).toBeInTheDocument()
    expect(getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Log in' })).toBeInTheDocument()
    expect(getByRole('link', { name: 'Browse forums as guest' })).toBeInTheDocument()
  })
})
