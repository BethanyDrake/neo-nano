import '@testing-library/jest-dom'
import 'whatwg-fetch';
import { setupServer } from 'msw/node';

jest.mock('@auth0/nextjs-auth0/server')
jest.mock('@neondatabase/serverless')
jest.mock('@neondatabase/serverless')
jest.mock('@/lib/richText/RichTextEditor', () => jest.requireActual('./MockRichTextEditor'))

process.env.DATABASE_URL = 'DATABASE_URL'

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

export const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());