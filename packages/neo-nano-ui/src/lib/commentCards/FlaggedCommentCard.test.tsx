import { render } from "@testing-library/react"
import { FlaggedCommentCard } from "./FlaggedCommentCard"
import { buildCommentSnapshot } from "../types/forum.builders"

describe('<FlaggedCommentCard />', () => {
    it('shows flag details, reason, and comment text', () => {
        const {container, getByText} = render(<FlaggedCommentCard flag={{
            id: 'flag1',
            reason: 'harrassment',
            details: 'extra details'
        }} comment={{
            id: 'comment2',
            richText: 'some rich text',
            text: ''
        }} snapshots={[]}/>)

        expect(getByText('#comment2-flag1')).toBeInTheDocument()
        expect(container).toHaveTextContent(/details: extra details/i)
        expect(container).toHaveTextContent(/reason: harrassment/i)
        expect(container).toHaveTextContent(/some rich text/i)
    })

    test('flag without extra details',  () => {
        const {container} = render(<FlaggedCommentCard flag={{
            id: 'flag1',
            reason: 'harrassment',
            details: ''
        }} comment={{
            id: 'comment2',
            richText: '',
            text: ''
        }} snapshots={[]}/>)

        expect(container).toHaveTextContent(/details: \(none\)/i)
    })


    test('comment with snapshots', () => {
        const {container} = render(<FlaggedCommentCard flag={{
            id: 'flag1',
            reason: 'harrassment',
            details: ''
        }} comment={{
            id: 'comment2',
            richText: 'current text',
            text: ''
        }} snapshots={[buildCommentSnapshot({id: '1', richText: 'snapshot 1'}), buildCommentSnapshot({id: '2', richText: 'snapshot 2'})]}/>)

        expect(container).toHaveTextContent(/current text/i)
        expect(container).toHaveTextContent(/snapshot 1/i)
        expect(container).toHaveTextContent(/snapshot 2/i)
    })
})