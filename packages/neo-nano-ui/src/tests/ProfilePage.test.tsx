import ProfilePage from '@/app/profile/page'
import { render } from '@testing-library/react'
import { mockRequest } from './utils/mswHelpers'
import { getMyProfile } from '@/app/api/profile/route'
import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'
import { SessionData } from '@auth0/nextjs-auth0/types'

jest.mock('@/lib/auth0')
jest.mock('next/navigation')
jest.mock('@/lib/UpdateWordCount')
jest.mock('@/app/api/profile/route')

describe('<ProfilePage />', () => {
  it('redirects if not logged in', async () => {
    jest.mocked(auth0.getSession).mockResolvedValue(null)

    render(await ProfilePage())
    expect(redirect).toHaveBeenCalled()
  })
  it('shows user details and goals', async () => {
    jest.mocked(auth0.getSession).mockResolvedValue('some session data' as unknown as SessionData)
    jest.mocked(getMyProfile).mockResolvedValue({
      displayName: 'Some Name',
      id: '1',
    })
    mockRequest('get', '/api/goals', {
      goals: [
        {
          title: 'Goal Title',
          id: '1',
          records: [],
        },
      ],
    })
    const { findByText } = render(await ProfilePage())
    expect(await findByText('Some Name')).toBeInTheDocument()
    expect(await findByText('Goal Title')).toBeInTheDocument()
  })
})
