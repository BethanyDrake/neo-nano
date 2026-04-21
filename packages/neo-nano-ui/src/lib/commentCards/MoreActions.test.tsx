import { fireEvent, render } from "@testing-library/react"
import { MoreActions } from "./MoreActions"
import { withUserContext } from "@/tests/utils/withUserContext"
import { wrap } from "souvlaki"
import { withCommentCartContext } from "@/tests/utils/withCommentCardContext"
import { buildCommentDataEntry } from "./CommentCard"

describe("<MoreActions />", () => {
    test('shows edit button on my comment', () => {
        const {getByRole} = render(<MoreActions />, { wrapper: wrap(withUserContext({id: 'my-id', role: 'user'}), withCommentCartContext({
            comment: buildCommentDataEntry(),
            author: {id: 'my-id', displayName: ""},
            flags: [],
            snapshots: []
        })) })

        fireEvent.click(getByRole('button', {name: 'more actions'}))
        expect(getByRole('menuitem', {name: 'edit'})).toBeInTheDocument()
    })

        test('hides edit button for comments that are not mine', () => {
        const {queryByRole, getByRole} = render(<MoreActions />, { wrapper: wrap(withUserContext({id: 'my-id', role: 'user'}), withCommentCartContext({
            comment: buildCommentDataEntry(),
            author: {id: 'other-id', displayName: ""},
            flags: [],
            snapshots: []
        })) })

        fireEvent.click(getByRole('button', {name: 'more actions'}))
        expect(queryByRole('menuitem', {name: 'edit'})).not.toBeInTheDocument()
    })
})