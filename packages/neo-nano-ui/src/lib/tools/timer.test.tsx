import { fireEvent, render } from '@testing-library/react'
import { Timer, Timer_Finished } from './timer'
import { buildGoal } from '../types/forum.builders'
import { useStopwatch, useTimer } from 'react-timer-hook'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { mock } from 'jest-mock-extended'
import { act, PropsWithChildren } from 'react'
jest.mock('./useActiveTimeBasedGoal', () => ({
  useUpdateActiveTimeBasedGoal: () => ({ addMinutes: jest.fn() }),
  useActiveTimeBasedGoal: () => ({}),
}))
jest.mock('react-timer-hook')

const Wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={mock<QueryClient>()}>{children}</QueryClientProvider>
)

describe('timer', () => {
  test('start a 5 minute timer, then cancel it', async () => {
    // @ts-expect-error test
    jest.mocked(useTimer).mockReturnValue({ minutes: 5, seconds: 30 })
    const { getByRole, findByText, getByText } = render(<Timer />)

    expect(getByText('Start a timer')).toBeInTheDocument()
    const input = getByRole('spinbutton', { name: 'minutes' })
    fireEvent.input(input, { target: { value: 5 } })
    fireEvent.click(getByRole('button', { name: 'Start' }))
    expect(await findByText('The clock is ticking...')).toBeInTheDocument()
    expect(getByText('5m 30s')).toBeInTheDocument()
    fireEvent.click(getByRole('button', { name: 'Cancel' }))
    expect(getByText('Start a timer')).toBeInTheDocument()
  })

  test('finish a 1 minute sprint', async () => {
    let _onExpire
    // @ts-expect-error test
    jest.mocked(useTimer).mockImplementation(({ onExpire }) => {
      _onExpire = onExpire
      return {}
    })
    // @ts-expect-error test
    jest.mocked(useStopwatch).mockReturnValue({ minutes: 0, seconds: 0 })
    const { getByRole, findByText, getByText } = render(<Timer />)

    expect(getByText('Start a timer')).toBeInTheDocument()
    const input = getByRole('spinbutton', { name: 'minutes' })
    fireEvent.input(input, { target: { value: 1 } })
    fireEvent.click(getByRole('button', { name: 'Start' }))
    expect(await findByText('The clock is ticking...')).toBeInTheDocument()
    act(() => {
      _onExpire!()
    })
    expect(await findByText('Complete!')).toBeInTheDocument()

    const wordCountInput = getByRole('spinbutton', { name: 'words' })
    fireEvent.input(wordCountInput, { target: { value: 50 } })
    fireEvent.click(getByRole('button', { name: 'Submit' }))

    expect(await findByText('Sprint 1')).toBeInTheDocument()
    expect(await findByText('1m')).toBeInTheDocument()
    expect(await findByText('50 words')).toBeInTheDocument()
    expect(await findByText('50.0 w/m')).toBeInTheDocument()
  })
})
