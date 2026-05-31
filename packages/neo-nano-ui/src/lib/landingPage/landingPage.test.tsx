import { act, render } from '@testing-library/react'
import LandingPage from '../../app/page'
import { vi } from 'vitest'
import { withReactQueryClient } from '@/tests/utils/withReactQueryClient'
import { wrap } from 'souvlaki'

vi.mock('@auth0/nextjs-auth0', () => ({useUser: () => ({})}))
vi.mock('@/lib/ClientSideOnly', () => ({ClientSideOnly: () => null}))
describe('Langing Page', () => {
    it('renders', async () => {
        await act(async () => render(<LandingPage />, {wrapper: wrap(withReactQueryClient())}))

    })
})