
import {render, screen} from '@testing-library/react'

import Home from './page'
describe('Home page', () => {
    it('does not explode', () => {
        render(<Home />)
        expect(screen.getByText("Deploy now")).toBeInTheDocument()
    })
})