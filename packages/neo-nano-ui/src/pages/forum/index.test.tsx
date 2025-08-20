import { render } from "@testing-library/react"
import {Forum} from "."

describe('<Forum />', () => {
    it('displays categories and topics', () => {
        const {getByText} = render(<Forum categories={[{
            id: '1',
            title: 'Some Category Title',
            topics: [{id: '2', title: "Some Topic Title", description: "some descripiton", icon: 'faPenFancy'}]
        }
        ]}/>)

        expect(getByText('Some Category Title')).toBeInTheDocument()
        expect(getByText('Some Topic Title')).toBeInTheDocument()
        expect(getByText('some descripiton')).toBeInTheDocument()
    })

})