import { useUser } from '@auth0/nextjs-auth0'
import { render } from '@testing-library/react'
import { GetStartedSection } from './GetStartedSection'

jest.mock('@auth0/nextjs-auth0')

const buildUseUserResponse = (overrides = {}) => ({
  isLoading: false,
  invalidate: jest.fn(),
  user: undefined,
  error: undefined,
  ...overrides,
})

describe('<GetStartedSection />', () => {
  test('loading state', () => {
    jest.mocked(useUser).mockReturnValue(buildUseUserResponse({ isLoading: true }))
    const { getByText } = render(<GetStartedSection />)
    expect(getByText('Get Started')).toBeInTheDocument()
  })

  test('logged in state', () => {
    jest.mocked(useUser).mockReturnValue(buildUseUserResponse({ user: { some: 'data' } }))
    const { getByText, getByRole } = render(<GetStartedSection />)
    expect(getByText('Get Started')).toBeInTheDocument()
    expect(getByRole('button', { name: 'Browse Forum' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Update Progress' })).toBeInTheDocument()
  })

  test('logged out state', () => {
    jest.mocked(useUser).mockReturnValue(buildUseUserResponse({ user: undefined }))
    const { getByText, getByRole } = render(<GetStartedSection />)
    expect(getByText('Get Started')).toBeInTheDocument()
    expect(getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Log in' })).toBeInTheDocument()
    expect(getByRole('link', { name: 'Browse forums as guest' })).toBeInTheDocument()
  })
})
