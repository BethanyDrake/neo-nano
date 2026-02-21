import { fireEvent, render, waitFor } from '@testing-library/react'
import { deleteGoal } from '../serverFunctions/goals/deleteGoal'
import { setGoalVisibility } from '../serverFunctions/goals/setGoalVisibility'
import { GoalSection } from './GoalSection'
import { isActive } from '../serverFunctions/goals/goalUtils'
import { vi } from 'vitest'
vi.mock('@/lib/serverFunctions/goals/setGoalVisibility')
vi.mock('@/lib/serverFunctions/goals/deleteGoal')
vi.mock('../serverFunctions/goals/goalUtils')

describe('<GoalSection />', () => {
  beforeEach(() => {
    vi.mocked(isActive).mockReturnValue(true)
    vi.mocked(deleteGoal).mockResolvedValue([])
    vi.mocked(setGoalVisibility).mockResolvedValue([])
  })
  it('displays goal', () => {
    const { getByText } = render(
      <GoalSection
        id="1"
        initialRecords={[]}
        visibility="private"
        title="Goal Title"
        lengthDays={0}
        startDate={''}
        target={0}
        metric={'words'}
      />,
    )
    expect(getByText('Goal Title'))
  })

  it('displays time-based goal', () => {
    const { queryByText } = render(
      <GoalSection
        id="1"
        initialRecords={[]}
        visibility="private"
        title="Goal Title"
        lengthDays={0}
        startDate={''}
        target={180}
        metric={'minutes'}
      />,
    )
    expect(queryByText(/words/)).not.toBeInTheDocument()
  })

  it('displays total words', () => {
    const { getByText, container } = render(
      <GoalSection
        id="1"
        initialRecords={[100, 200]}
        visibility="private"
        title="Goal Title"
        lengthDays={2}
        startDate={''}
        target={0}
        metric={'words'}
      />,
    )
    expect(getByText('Goal Title'))
    expect(container).toHaveTextContent(/So far\: 300/)
  })

  test('toggle privacy', async () => {
    const { getByRole, findByRole, rerender } = render(
      <GoalSection
        id="goal-id"
        initialRecords={[]}
        visibility="private"
        title="Goal Title"
        lengthDays={0}
        startDate={''}
        target={0}
        metric={'words'}
      />,
    )
    fireEvent.click(getByRole('button', { name: 'make public' }))
    expect(setGoalVisibility).toHaveBeenCalledWith({ id: 'goal-id', visibility: 'public' })
    rerender(
      <GoalSection
        id="goal-id"
        initialRecords={[]}
        visibility="public"
        title="Goal Title"
        lengthDays={0}
        startDate={''}
        target={0}
        metric={'words'}
      />,
    )
    expect(await findByRole('button', { name: 'make private' }))
  })

  test('toggle cumulative/perday', async () => {
    const { getByRole } = render(
      <GoalSection
        id="goal-id"
        initialRecords={[]}
        visibility="private"
        title="Goal Title"
        lengthDays={0}
        startDate={''}
        target={0}
        metric={'words'}
      />,
    )
    fireEvent.click(getByRole('switch', { name: /Words Per Day.*Cumulative/i }))
  })

  test('delete goal', async () => {
    const { getByRole } = render(
      <GoalSection
        id="goal-id"
        initialRecords={[]}
        visibility="private"
        title="Goal Title"
        lengthDays={0}
        startDate={''}
        target={0}
        metric={'words'}
      />,
    )
    fireEvent.click(getByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(deleteGoal).toHaveBeenCalledWith('goal-id')
    })
  })
})
