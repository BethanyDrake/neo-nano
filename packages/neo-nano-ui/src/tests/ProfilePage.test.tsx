import ProfilePage from '@/app/profile/page'
import { render } from '@testing-library/react'
import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'
import { SessionData } from '@auth0/nextjs-auth0/types'
import { getMyProfile } from '@/lib/apiUtils/getMyProfile'
import { getMyGoals } from '@/lib/apiUtils/goals/getMyGoals'

jest.mock('@/lib/auth0')
jest.mock('next/navigation')
jest.mock('@/lib/UpdateWordCount')
jest.mock('@/lib/apiUtils/getMyProfile')
jest.mock('@/lib/apiUtils/goals/getMyGoals')
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
    jest.mocked(getMyGoals).mockResolvedValue([
        {
          title: 'Goal Title',
          id: '1',
          records: [],
          userId: '2',
          target: 50000,
          startDate: '2025-11-01',
          lengthDays: 30
        },
      ])
    const { findByText } = render(await ProfilePage())
    expect(await findByText('Some Name')).toBeInTheDocument()
    expect(await findByText('Goal Title')).toBeInTheDocument()
  })
})
