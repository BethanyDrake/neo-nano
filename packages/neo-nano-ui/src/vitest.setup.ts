/// <reference types="vitest/browser" />
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import ResizeObserver from 'resize-observer-polyfill';
import { PropsWithChildren } from 'react'

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
vi.mock('@/lib/richText/RichTextEditor', () => vi.importActual('./__mocks__/MockRichTextEditor'))
vi.mock('@/lib/richText/RichTextDisplay', () => vi.importActual('./__mocks__/MockRichTextDisplay'))
vi.mock('canvas-confetti')
vi.mock('@/lib/ClientSideOnly', () => ({ClientSideOnly: ({children}: PropsWithChildren) => children}))

globalThis.ResizeObserver = ResizeObserver;