import { fireEvent, render, waitFor } from '@testing-library/react'
import { buildGoal } from '@/lib/types/forum.builders'
import { vi } from 'vitest'
import { useActiveGoal, useUpdateActiveGoal } from '../focusClockTool/useActiveGoal'
import { WordCounter } from './WordCounter'
vi.mock('../focusClockTool/useActiveGoal')
vi.mock('react-timer-hook')

describe('word counter', () => {
  test('add to todays total', async () => {
    const addValue = vi.fn()
    vi.mocked(useUpdateActiveGoal).mockReturnValue({ addValue})
    vi.mocked(useActiveGoal).mockReturnValue({
      isLoading: false,
      error: null,
      goal: buildGoal({ title: 'Some Active Goal' }),
    })

    const { container, getByRole, getByText } = render(<WordCounter />)
    fireEvent.input(getByRole('textbox'), { target: { value: 'This is four words.' } })
    fireEvent.click(getByRole('button', { name: /analyse/i }))

    await waitFor(() => {
      expect(container).toHaveTextContent(/Word Count: 4/)
    })

    expect(getByText('Update Some Active Goal'))

    fireEvent.click(getByRole('button', {name: '+4 words'}))
    expect(addValue).toHaveBeenCalledWith(4)
    expect(getByRole('button', {name: '+4 words'})).toBeDisabled()
  })
})
