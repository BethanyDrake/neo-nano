import { render } from "@testing-library/react"
import { FlaggedCommentCard } from "./FlaggedCommentCard"

describe('<FlaggedCommentCard />', () => {
    it('renders', () => {
        const {container, getByText} = render(<FlaggedCommentCard flag={{
            id: 'flag1',
            reason: 'harrassment',
            details: ''
        }} comment={{
            id: 'comment2',
            richText: '<p>Some rich text</p>',
            text: ''
        }} />)

        expect(getByText('#comment2-flag1')).toBeInTheDocument()
        expect(container).toHaveTextContent(/details: \(none\)/i)
        expect(container).toHaveTextContent(/reason: harrassment/i)
    })
})