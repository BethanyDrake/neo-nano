import { render } from "@testing-library/react"
import { CommentCard } from "./CommentCard"

describe('<CommentCard />', () => {
  it('renders', () => {
    const {getByText} =render(<CommentCard comment={{id: '1', text: 'Some text.'}} author={{id: '2', displayName: 'Some Name'}}/>)
    expect(getByText(/Some text/)).toBeInTheDocument()
    expect(getByText('Some Name')).toBeInTheDocument()
  })
})