import { render } from "@testing-library/react"
import Forum from "@/app/forum/page"
import { mockRequest } from "./utils/mswHelpers"

describe('<Forum />', () => {
    it('displays categories and topics', async () => {
         mockRequest('get', '/undefined/api/topics', {categories:[{
            id: '1',
            title: 'Some Category Title',
            topics: [{id: '2', title: "Some Topic Title", description: "some descripiton", icon: 'faPenFancy'}]
        }]})
        const {getByText} = render(await Forum())

        expect(getByText('Some Category Title')).toBeInTheDocument()
        expect(getByText('Some Topic Title')).toBeInTheDocument()
        expect(getByText('some descripiton')).toBeInTheDocument()
    })
})