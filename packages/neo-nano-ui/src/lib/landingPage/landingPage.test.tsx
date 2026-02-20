import { act, render } from '@testing-library/react'
import LandingPage from '../../app/page'
import { vi } from 'vitest'

vi.mock('@auth0/nextjs-auth0', () => ({useUser: () => ({})}))
vi.mock('@/lib/ClientSideOnly', () => ({ClientSideOnly: () => null}))
describe('Langing Page', () => {
    it('renders', async () => {
        await act(async () => render(<LandingPage />))

    })
})