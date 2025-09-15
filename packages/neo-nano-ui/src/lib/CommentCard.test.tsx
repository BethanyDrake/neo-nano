import { fireEvent, render } from '@testing-library/react'
import { CommentCard } from './CommentCard'
import { flagComment } from './apiUtils/flagComment'

jest.mock('./apiUtils/flagComment')

describe('<CommentCard />', () => {
  it('renders', () => {
    const { getByText } = render(
      <CommentCard comment={{ id: '1', text: 'Some text.' }} author={{ id: '2', displayName: 'Some Name' }} />,
    )
    expect(getByText(/Some text/)).toBeInTheDocument()
    expect(getByText(/Some Name/)).toBeInTheDocument()
  })

  test('flag a comment as innapropriate', () => {
    const { getByRole } = render(
      <CommentCard comment={{ id: 'comment-id', text: '' }} author={{ id: '2', displayName: '' }} />,
    )
    fireEvent.click(getByRole('button', { name: 'Report comment as inappropriate' }))
    expect(flagComment).toHaveBeenCalledWith('comment-id')
  })
})
