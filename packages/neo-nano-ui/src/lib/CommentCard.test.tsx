import { fireEvent, render, waitFor } from '@testing-library/react'
import { CommentCard } from './CommentCard'
import { flagComment } from './serverFunctions/moderation/flagComment'

jest.mock('./serverFunctions/moderation/flagComment')

describe('<CommentCard />', () => {
  it('renders', () => {
    const { getByText } = render(
      <CommentCard comment={{ id: '1', text: 'Some text.' }} author={{ id: '2', displayName: 'Some Name' }} flags={[]} />,
    )
    expect(getByText(/Some text/)).toBeInTheDocument()
    expect(getByText(/Some Name/)).toBeInTheDocument()
  })

  test('flag a comment as innapropriate', async () => {
    const { getByRole } = render(
      <CommentCard comment={{ id: 'comment-id', text: '' }} author={{ id: '2', displayName: '' }} flags={[]}/>,
    )
    fireEvent.click(getByRole('button', { name: 'Report comment as inappropriate' }))
    expect(getByRole('heading', { name: 'Report Comment as Inappropriate' })).toBeInTheDocument()
    fireEvent.click(getByRole('radio', { name: 'harrassment' }))
    fireEvent.input(getByRole('textbox', { name: 'More details:' }), { target: { value: 'Some details.' } })
    fireEvent.click(getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(flagComment).toHaveBeenCalledWith({
        comment: 'comment-id',
        details: 'Some details.',
        reason: 'harrassment',
      })
    })
  })
})
