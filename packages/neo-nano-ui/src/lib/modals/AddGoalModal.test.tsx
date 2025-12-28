import { fireEvent, render, waitFor } from '@testing-library/react'
import { createGoal } from '../serverFunctions/goals/createGoal'
import { AddGoalModal } from './AddGoalModal'
import { ModalContextProvider } from './ModalContext'
import {  ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'
import { getCurrentChallenge } from '../challenges'
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn().mockReturnValue({get: () => undefined})
}))
jest.mock('../serverFunctions/goals/createGoal')

jest.mock('../challenges')

describe('AddGoalModal', () => {
  test('add default goal', async () => {
    jest.mocked(createGoal).mockResolvedValue([])
    jest.mocked(getCurrentChallenge).mockReturnValue({
      lengthDays: 30,
      startDate: '2025-11-01',
      target: 50000,
      title: 'November 2025',
      metric: 'words',
      id: 'challenge-id'
    })
    const { getByRole, queryByRole } = render(<ModalContextProvider><AddGoalModal /></ModalContextProvider>)
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
      metric: 'words'
    })
  })

  test('add custom goal', async () => {
    jest.mocked(createGoal).mockResolvedValue([])
    const { getByRole, queryByRole, getByLabelText } = render(<ModalContextProvider><AddGoalModal /></ModalContextProvider>)
    fireEvent.click(getByRole('button', { name: 'add goal' }))
    expect(getByRole('heading', { name: 'Add Goal' })).toBeInTheDocument()

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
      metric: 'words'
    })
  })

  it('opens by default using pathname action', () => {
    jest.mocked(useSearchParams).mockReturnValue({get: () => 'createGoal'} as unknown as ReadonlyURLSearchParams)
    const { getByRole } = render(<ModalContextProvider><AddGoalModal /></ModalContextProvider>)
     expect(getByRole('heading', { name: 'Add Goal' })).toBeInTheDocument()
  })

})
