import { ProfilePage } from '@/pages/profile'
import { User } from '@auth0/nextjs-auth0/types'
import { render } from '@testing-library/react'

describe('<ProfilePage />', () => {
  it('shows user details', () => {
    const { getByText } = render(<ProfilePage user={{ name: 'Some Name' } as User} />)
    expect(getByText('Some Name')).toBeInTheDocument()
  })
})
