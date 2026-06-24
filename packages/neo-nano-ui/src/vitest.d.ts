import 'vitest'

declare module 'vitest' {
  interface Matchers {
    toBeNear: (target: number, difference: number) => R
  }
}