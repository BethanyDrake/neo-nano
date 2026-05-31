import { fireEvent, render, waitFor } from '@testing-library/react'
import { createGoal } from '../serverFunctions/goals/createGoal'
import { AddGoalModal } from './AddGoalModal'
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'
import { getCurrentChallenge } from '../challenges'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import { vi } from 'vitest'
import { withModalContext } from '@/tests/utils/withModalContext'
import { withReactQueryClient } from '@/tests/utils/withReactQueryClient'
import { wrap } from 'souvlaki'
import { getMyGoals } from '../serverFunctions/goals/getMyGoals'
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn().mockReturnValue({ get: () => undefined }),
}))
vi.mock('../serverFunctions/goals/createGoal')
vi.mock('../serverFunctions/goals/getMyGoals')

vi.mock('../challenges')
vi.mock('@/lib/hooks/useIsLoggedIn')

describe('AddGoalModal', () => {
  beforeEach(() => {
    vi.mocked(useIsLoggedIn).mockReturnValue(true)
    vi.mocked(useSearchParams).mockReturnValue({ get: vi.fn() } as unknown as ReadonlyURLSearchParams)
    vi.mocked(getMyGoals).mockResolvedValue([])
  })
  test('add default goal', async () => {

    vi.mocked(createGoal).mockResolvedValue([])
    vi.mocked(getCurrentChallenge).mockReturnValue({
      lengthDays: 30,
      startDate: '2025-11-01',
      target: 50000,
      title: 'November 2025',
      metric: 'words',
      id: 'challenge-id',
    })
    const { getByRole, queryByRole} = render(<AddGoalModal />, {
      wrapper: wrap(withModalContext(), withReactQueryClient()),
    })
    await waitFor(()=> expect(getByRole('button', { name: 'add goal' })).toBeEnabled())
    fireEvent.click(getByRole('button', { name: 'add goal' }))
    expect(getByRole('heading', { name: 'Add Goal' }))
    fireEvent.click(getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(queryByRole('heading', { name: 'Add Goal' })).not.toBeInTheDocument()
    })
    expect(createGoal).toHaveBeenCalledWith({
      lengthDays: 30,
      startDate: '2025-11-01',
      target: 50000,
      title: 'November 2025',
      visibility: 'private',
      metric: 'words',
    })
  })

  test('add custom goal', async () => {
    
    vi.mocked(createGoal).mockResolvedValue([])
    const { getByRole, queryByRole, getByLabelText } = render(<AddGoalModal />, {
      wrapper: wrap(withModalContext(), withReactQueryClient()),
    })

        await waitFor(()=> expect(getByRole('button', { name: 'add goal' })).toBeEnabled())
    fireEvent.click(getByRole('button', { name: 'add goal' }))
    expect(getByRole('heading', { name: 'Add Goal' }))

    fireEvent.change(getByRole('textbox', { name: /Title/ }), { target: { value: 'Some Title' } })
    fireEvent.change(getByRole('spinbutton', { name: /Duration/ }), { target: { value: '10' } })
    fireEvent.change(getByRole('spinbutton', { name: /Target/ }), { target: { value: '25000' } })
    fireEvent.change(getByLabelText(/Start Date/), { target: { value: '2000-01-15' } })
    fireEvent.change(getByRole('combobox', { name: /Visibility/ }), { target: { value: 'public' } })

    fireEvent.click(getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(queryByRole('heading', { name: 'Add Goal' })).not.toBeInTheDocument()
    })
    expect(createGoal).toHaveBeenCalledWith({
      lengthDays: 10,
      startDate: '2000-01-15',
      target: 25000,
      title: 'Some Title',
      visibility: 'public',
      metric: 'words',
    })
  })

  it('opens by default using pathname action', () => {
    vi.mocked(useSearchParams).mockReturnValue({ get: () => 'createGoal' } as unknown as ReadonlyURLSearchParams)
    const { getByRole } = render(<AddGoalModal />, {
      wrapper: wrap(withModalContext(), withReactQueryClient()),
    })
    expect(getByRole('heading', { name: 'Add Goal' }))
  })
})
