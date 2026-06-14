import { fireEvent, render, waitFor } from '@testing-library/react'
import { AddEditGoalForm } from './AddEditGoalForm'
import { wrap } from 'souvlaki'
import { withReactQueryClient } from '@/tests/utils/withReactQueryClient'

describe('AddEditGoalForm', () => {
  test('add a new goal', async () => {
    const onSave = vi.fn()
    const { getByRole, getByText } = render(
      <AddEditGoalForm
        mode={'add'}
        defaultValues={{
          title: '',
          startDate: '2026-11-01',
          lengthDays: '',
          target: '',
          visibility: 'private',
          metric: 'hours',
        }}
        onSave={onSave}
      />, {wrapper: wrap(withReactQueryClient())}
    )

    expect(getByText('Add Goal')).toBeInTheDocument()
    fireEvent.change(getByRole('textbox', { name: 'Title:' }), { target: { value: 'Some Title' } })
    fireEvent.change(getByRole('spinbutton', { name: 'Duration:' }), { target: { value: '30' } })
    fireEvent.change(getByRole('spinbutton', { name: 'Target:' }), { target: { value: '50000' } })
    fireEvent.change(getByRole('combobox', { name: 'progress unit' }), { target: { value: 'words' } })
    fireEvent.change(getByRole('combobox', { name: 'Visibility:' }), { target: { value: 'public' } })
    fireEvent.click(getByRole('button', { name: 'Save' }))
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        lengthDays: 30,
        metric: 'words',
        startDate: '2026-11-01',
        target: 50000,
        title: 'Some Title',
        visibility: 'public',
      })
    })
  })

   test('update existing goal', async () => {
    const onSave = vi.fn()
    const { getByRole, getByText } = render(
      <AddEditGoalForm
        mode={'edit'}
        defaultValues={{
          title: 'Old Title',
          startDate: '2026-11-01',
          lengthDays: '30',
          target: '50000',
          visibility: 'private',
          metric: 'words',
        }}
        onSave={onSave}
      />, {wrapper: wrap(withReactQueryClient())}
    )

    expect(getByText('Update Goal')).toBeInTheDocument()
    fireEvent.change(getByRole('textbox', { name: 'Title:' }), { target: { value: 'New Title' } })
    fireEvent.click(getByRole('button', { name: 'Save' }))
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        lengthDays: 30,
        metric: 'words',
        startDate: '2026-11-01',
        target: 50000,
        title: 'New Title',
        visibility: 'private',
      })
    })
  })
})
