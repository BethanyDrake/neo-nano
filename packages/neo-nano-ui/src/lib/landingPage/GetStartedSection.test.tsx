import {  render} from '@testing-library/react'
import { GetStartedSection } from './GetStartedSection'

import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn'
import { useHasActiveOrUpcomingGoal } from '@/lib/hooks/useHasActiveOrUpcomingGoal'

jest.mock('@/lib/hooks/useIsLoggedIn')

jest.mock('@/lib/hooks/useHasActiveOrUpcomingGoal')
describe('<GetStartedSection />', () => {

  test('loading state', () => {
    jest.mocked(useIsLoggedIn).mockReturnValue({ isLoading: true, isLoggedIn: false })
    jest.mocked(useHasActiveOrUpcomingGoal).mockReturnValue({ isLoading: true, hasActiveOrUpcomingGoal: undefined })
    const { getByText } = render(<GetStartedSection />)
    expect(getByText('Get Started')).toBeInTheDocument()
  })

  test('logged in - no active or upcoming goals', () => {
    jest.mocked(useIsLoggedIn).mockReturnValue({ isLoading: false, isLoggedIn: true })
        jest.mocked(useHasActiveOrUpcomingGoal).mockReturnValue({ isLoading: false, hasActiveOrUpcomingGoal: false })
    const { getByText, getByRole } = render(<GetStartedSection />)
    expect(getByText('Get Started')).toBeInTheDocument()
    expect(getByRole('button', { name: 'Browse Forum' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Join The Challenge' })).toBeInTheDocument()
  })

    test('logged in - already joined challenge', () => {
    jest.mocked(useIsLoggedIn).mockReturnValue({ isLoading: false, isLoggedIn: true })
        jest.mocked(useHasActiveOrUpcomingGoal).mockReturnValue({ isLoading: false, hasActiveOrUpcomingGoal: true })
    const { getByText, getByRole } = render(<GetStartedSection />)
    expect(getByText('Get Started')).toBeInTheDocument()
    expect(getByRole('button', { name: 'Browse Forum' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Update Progress' })).toBeInTheDocument()
  })

  test('logged out', () => {
    jest.mocked(useIsLoggedIn).mockReturnValue({ isLoading: false, isLoggedIn: false })
    jest.mocked(useHasActiveOrUpcomingGoal).mockReturnValue({ isLoading: false, hasActiveOrUpcomingGoal: undefined })
    const { getByText, getByRole } = render(<GetStartedSection />)
    expect(getByText('Get Started')).toBeInTheDocument()
    expect(getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Log in' })).toBeInTheDocument()
    expect(getByRole('link', { name: 'Browse forums as guest' })).toBeInTheDocument()
  })
})
