import { render } from '@testing-library/react'
import LandingPage from '../../app/page'

jest.mock('@auth0/nextjs-auth0', () => ({useUser: () => ({})}))
jest.mock('@/lib/ClientSideOnly', () => ({ClientSideOnly: () => null}))
describe('Langing Page', () => {
    it('renders', () => {
        render(<LandingPage />)

    })
})