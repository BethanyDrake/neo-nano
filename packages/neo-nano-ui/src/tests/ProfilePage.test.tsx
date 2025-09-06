import { ProfilePage } from '@/pages/profile'
import { render } from '@testing-library/react'
import { mockRequest } from './utils/mswHelpers'

jest.mock('@/lib/UpdateWordCount')

describe('<ProfilePage />', () => {
  it('shows user details and goals', async () => {
     mockRequest('get', '/api/profile', {profile: {
      displayName: 'Some Name',
      id: '1',
    }})
    mockRequest('get', '/api/goals', {goals: [{
      title: 'Goal Title',
      id: '1',
      records: []
    }]})
    const { findByText } = render(<ProfilePage />)
    expect(await findByText('Some Name')).toBeInTheDocument()
    expect(await findByText('Goal Title')).toBeInTheDocument()
  })
})
