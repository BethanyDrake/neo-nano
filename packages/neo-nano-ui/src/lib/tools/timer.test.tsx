import { render } from '@testing-library/react'
import { Timer_Finished } from './timer'
import { buildGoal } from '../types/forum.builders'
import { useStopwatch } from 'react-timer-hook'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { mock } from 'jest-mock-extended'
import { PropsWithChildren } from 'react'
jest.mock('./useActiveTimeBasedGoal', () => ({
  useUpdateActiveTimeBasedGoal: () => ({ addMinutes: jest.fn() }),
}))
jest.mock('react-timer-hook')

const Wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={mock<QueryClient>()}>{children}</QueryClientProvider>
)

describe('timer', () => {
  describe('finished state', () => {
    test('no active goal', () => {
      // @ts-expect-error test
      jest.mocked(useStopwatch).mockReturnValue({ minutes: 0 })
      const { getAllByRole, getByRole } = render(
        <Timer_Finished targetTime={0} onReset={jest.fn()} onRepeat={jest.fn()} />,
        { wrapper: Wrapper },
      )

      expect(getByRole('button', { name: 'Repeat' })).toBeInTheDocument()
      expect(getByRole('button', { name: 'New target' })).toBeInTheDocument()
      expect(getAllByRole('button')).toHaveLength(2)
    })

    test('add target time to active goal', () => {
      // @ts-expect-error test
      jest.mocked(useStopwatch).mockReturnValue({ minutes: 0 })
      const { getAllByRole, getByRole } = render(
        <Timer_Finished
          targetTime={600}
          onReset={jest.fn()}
          onRepeat={jest.fn()}
          activeGoal={buildGoal({ id: 'someId' })}
        />,
        { wrapper: Wrapper },
      )
      expect(getByRole('button', { name: "Add 10 minutes to today's goal" })).toBeInTheDocument()
      expect(getAllByRole('button')).toHaveLength(3)
    })

    test('add extra time to active goal', () => {
      // @ts-expect-error test
      jest.mocked(useStopwatch).mockReturnValue({ minutes: 5 })
      const { getAllByRole, getByRole } = render(
        <Timer_Finished
          targetTime={600}
          onReset={jest.fn()}
          onRepeat={jest.fn()}
          activeGoal={buildGoal({ id: 'someId' })}
        />,
        { wrapper: Wrapper },
      )
      expect(getByRole('button', { name: "Add 15 minutes to today's goal" })).toBeInTheDocument()
      expect(getAllByRole('button')).toHaveLength(4)
    })
  })
})
