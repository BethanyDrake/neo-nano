import { useUser } from "@auth0/nextjs-auth0"

/* eslint-disable @typescript-eslint/no-explicit-any */
type State = 'loggedIn' | 'loggedOut' | 'loading'
/**
 * mocks return value of mockUseUser
 * 
 */
export const mockAuthState = (state: State) => {
  jest.mocked(useUser).mockReturnValue({
          isLoading: state === 'loading', user: state === 'loggedIn' ? {
            sub: 'some-id'
          } : null,
          error: undefined,
          invalidate: jest.fn()
    } as any)

}