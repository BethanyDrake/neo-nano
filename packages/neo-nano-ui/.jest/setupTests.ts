import '@testing-library/jest-dom'
import 'whatwg-fetch';
import { setupServer } from 'msw/node';

jest.mock('@auth0/nextjs-auth0/server')

export const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());