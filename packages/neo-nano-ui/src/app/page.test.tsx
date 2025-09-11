
import {render, screen} from '@testing-library/react'
import Home from './page'
import { auth0 } from '@/lib/auth0'
jest.mock('@/lib/auth0')
jest.mocked(auth0.getSession).mockResolvedValue(null)
describe('Home page', () => {
    it('not loged in',async  () => {
        render(await Home())
        expect(screen.getByText("Sign up")).toBeInTheDocument()
    })
})