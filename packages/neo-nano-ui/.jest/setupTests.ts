import '@testing-library/jest-dom'
import 'whatwg-fetch';
import { setupServer } from 'msw/node';

import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });


export const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());