import { fireEvent, render, waitFor } from '@testing-library/react'
import { GoalSection } from './GoalSection'
import { setGoalVisibility } from '../serverFunctions/goals/setGoalVisibility'
import { deleteGoal } from '../serverFunctions/goals/deleteGoal'

jest.mock('./UpdateWordCount')
jest.mock('@/lib/serverFunctions/goals/setGoalVisibility', () => ({
  setGoalVisibility: jest.fn().mockResolvedValue(undefined),
}))
jest.mock('@/lib/serverFunctions/goals/deleteGoal', () => ({
  deleteGoal: jest.fn().mockResolvedValue([]),
}))

describe('<GoalSection />', () => {
  it('displays goal', () => {
    const { getByText } = render(
      <GoalSection
        id="1"
        initialRecords={[]}
        initialVisibility="private"
        title="Goal Title"
        lengthDays={0}
        startDate={''}
        target={0}
      />,
    )
    expect(getByText('Goal Title')).toBeInTheDocument()
  })

  it('displays total words', () => {
    const { getByText, container } = render(
      <GoalSection
        id="1"
        initialRecords={[100, 200]}
        initialVisibility="private"
        title="Goal Title"
        lengthDays={2}
        startDate={''}
        target={0}
      />,
    )
    expect(getByText('Goal Title')).toBeInTheDocument()
    expect(container).toHaveTextContent(/Total\: 300/)
  })

  test('toggle privacy', async () => {
    const { getByRole, findByRole } = render(
      <GoalSection
        id="goal-id"
        initialRecords={[]}
        initialVisibility="private"
        title="Goal Title"
        lengthDays={0}
        startDate={''}
        target={0}
      />,
    )
    fireEvent.click(getByRole('button', { name: 'make public' }))
    expect(setGoalVisibility).toHaveBeenCalledWith({ id: 'goal-id', visibility: 'public' })
    expect(await findByRole('button', { name: 'make private' })).toBeInTheDocument()
  })

  test('toggle cumulative/perday', async () => {
    const { getByRole } = render(
      <GoalSection
        id="goal-id"
        initialRecords={[]}
        initialVisibility="private"
        title="Goal Title"
        lengthDays={0}
        startDate={''}
        target={0}
      />,
    )
    fireEvent.click(getByRole('switch', { name: 'Words Per Day • Cumulative' }))
  })

  test('delete goal', async () => {
    const { getByRole } = render(
      <GoalSection
        id="goal-id"
        initialRecords={[]}
        initialVisibility="private"
        title="Goal Title"
        lengthDays={0}
        startDate={''}
        target={0}
      />,
    )
    fireEvent.click(getByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(deleteGoal).toHaveBeenCalledWith('goal-id')
    })
  })
})
