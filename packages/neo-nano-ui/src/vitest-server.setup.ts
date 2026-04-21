/// <reference types="vitest/browser" />
import {config} from 'dotenv'
import { vi } from 'vitest'
config({ path: `.env.test`})
vi.mock('@auth0/nextjs-auth0')
vi.mock('@auth0/nextjs-auth0/server', () => ({
    Auth0Client: class { public getSession = vi.fn()}
}))

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
  redirect: vi.fn()
}));
