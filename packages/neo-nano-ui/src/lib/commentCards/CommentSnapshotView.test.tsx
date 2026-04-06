import { fireEvent, render } from "@testing-library/react"
import { CommentSnapshotView } from "./CommentSnapshotView"

describe("<CommentSnapshotView />", () => {
    test("view and hide original comment", () => {
        const {getByRole, getByText} = render(<CommentSnapshotView snapshot={{
            version: 0,
            richText: "original text",
            postedAt: new Date()
        }} />)

        fireEvent.click(getByRole('button', {name: '(view original)'}))
        expect(getByText(/original text/)).toBeInTheDocument()
    })

      test("view and hide later versions", () => {
        const {getByRole, getByText} = render(<CommentSnapshotView snapshot={{
            version: 12,
            richText: "original text",
            postedAt: new Date()
        }} />)

        fireEvent.click(getByRole('button', {name: '(view v12)'}))
        expect(getByText(/original text/)).toBeInTheDocument()
    })
})