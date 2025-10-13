import { fireEvent, render, waitFor } from '@testing-library/react'
import { createGoal } from '../serverFunctions/goals/createGoal'
import { AddGoalModal } from './AddGoalModal'
jest.mock('../serverFunctions/goals/createGoal')

describe('AddGoalModal', () => {
  test('add default goal', async () => {
    jest.mocked(createGoal).mockResolvedValue([])
    const { getByRole, queryByRole } = render(<AddGoalModal />)
    fireEvent.click(getByRole('button', { name: 'add goal' }))
    expect(getByRole('heading', { name: 'Add Goal' })).toBeInTheDocument()
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
    })
  })

  test('add custom goal', async () => {
    jest.mocked(createGoal).mockResolvedValue([])
    const { getByRole, queryByRole, getByLabelText } = render(<AddGoalModal />)
    fireEvent.click(getByRole('button', { name: 'add goal' }))
    expect(getByRole('heading', { name: 'Add Goal' })).toBeInTheDocument()

    fireEvent.change(getByRole('textbox', { name: /Title/ }), { target: { value: 'Some Title' } })
    fireEvent.change(getByRole('spinbutton', { name: /Duration/ }), { target: { value: '10' } })
    fireEvent.change(getByRole('spinbutton', { name: /Target Word Count/ }), { target: { value: '25000' } })
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
    })
  })
})
