import { fireEvent, render, waitFor } from '@testing-library/react'
import { updateGoal } from '../serverFunctions/goals/updateGoal'
import { EditGoalModal } from './EditGoalModal'
import { ModalContextProvider } from './ModalContext'
jest.mock('../serverFunctions/goals/updateGoal')

describe('EditGoalModal', () => {
  test('update title', async () => {
    jest.mocked(updateGoal).mockResolvedValue([])
    const { getByRole, queryByRole } = render(
        <EditGoalModal
          initialGoal={{
            id: 'goal-id',
            title: 'Old Title',
            target: 50000,
            visibility: 'public',
            lengthDays: 30,
            startDate: '2025-11-01',
            metric: 'words'
          }}
        />, {wrapper: ModalContextProvider}
    )
    fireEvent.click(getByRole('button', { name: 'edit goal' }))
    expect(getByRole('heading', { name: 'Update Goal' })).toBeInTheDocument()

    fireEvent.change(getByRole('textbox', { name: /Title/ }), { target: { value: 'New Title' } })

    fireEvent.click(getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(queryByRole('heading', { name: 'Update Goal' })).not.toBeInTheDocument()
    })
    expect(updateGoal).toHaveBeenCalledWith(
      'goal-id',
      expect.objectContaining({
        title: 'New Title',
        target: 50000,
        visibility: 'public',
      }),
    )
  })

    it('converts minutes to hours', async () => {
    jest.mocked(updateGoal).mockResolvedValue([])
    const { getByRole, queryByRole } = render(
        <EditGoalModal
          initialGoal={{
            id: 'goal-id',
            title: 'Old Title',
            target: 60,
            visibility: 'public',
            lengthDays: 30,
            startDate: '2025-11-01',
            metric: 'minutes'
          }}
        />, {wrapper: ModalContextProvider}
    )
    fireEvent.click(getByRole('button', { name: 'edit goal' }))
    expect(getByRole('heading', { name: 'Update Goal' })).toBeInTheDocument()

    expect(getByRole('spinbutton', { name: /target:/i })).toHaveValue(1)
    expect(getByRole('combobox', { name: /progress unit/i })).toHaveValue('hours')

    fireEvent.change(getByRole('spinbutton', { name: /target:/i }), { target: { value: '2' } })

    fireEvent.click(getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(queryByRole('heading', { name: 'Update Goal' })).not.toBeInTheDocument()
    })
    expect(updateGoal).toHaveBeenCalledWith(
      'goal-id',
      expect.objectContaining({
        title: 'Old Title',
        target: 120,
        visibility: 'public',
      }),
    )
  })
})
