/// <reference types="vitest/browser" />
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { setupServer } from 'msw/node';
vi.mock('@auth0/nextjs-auth0')
vi.mock('@auth0/nextjs-auth0/server', () => ({
    Auth0Client: class { public getSession = vi.fn()}
}))

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn()
}));
vi.mock('@neondatabase/serverless')
vi.mock('@/lib/richText/RichTextEditor', () => vi.importActual('./__mocks__/MockRichTextEditor'))
vi.mock('@/lib/richText/RichTextDisplay', () => vi.importActual('./__mocks__/MockRichTextDisplay'))
vi.mock('canvas-confetti')

process.env.DATABASE_URL = 'DATABASE_URL'

export const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => {
    server.resetHandlers()
    window.localStorage.clear()
});
afterAll(() => server.close());