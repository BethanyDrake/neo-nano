import { ProfilePage } from '@/pages/profile'
import { User } from '@auth0/nextjs-auth0/types'
import { render } from '@testing-library/react'
import { mockRequest } from './utils/mswHelpers'

jest.mock('@/lib/UpdateWordCount')

describe('<ProfilePage />', () => {
  it('shows user details and goals', async () => {
    mockRequest('get', '/api/goals', {goals: [{
      title: 'Goal Title',
      id: '1',
      records: []
    }]})
    const { getByText, findByText } = render(<ProfilePage user={{ name: 'Some Name' } as User} />)
    expect(getByText('Some Name')).toBeInTheDocument()
    expect(await findByText('Goal Title')).toBeInTheDocument()
  })
})
