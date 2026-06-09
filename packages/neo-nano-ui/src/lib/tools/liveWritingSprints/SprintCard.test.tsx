import { fireEvent, render, waitFor } from '@testing-library/react'
import { PastSprintCard, UpcomingSprintCard } from './SprintCard'
import { minutesToSeconds } from 'date-fns'
import { wrap } from 'souvlaki'
import { withReactQueryClient } from '@/tests/utils/withReactQueryClient'
import { getPublicSprintLog, registerForPublicSprint } from '@/lib/serverFunctions/sprints/publicSprint'
import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn'
import { getMyUpcomingSprints } from '@/lib/serverFunctions/sprints/publicSprint'
import { Sprint } from '@/lib/serverFunctions/sprints/recordPrivateSprint'

vi.mock('@/lib/serverFunctions/sprints/publicSprint')
vi.mock('@/lib/hooks/useIsLoggedIn')
describe('SprintCards', () => {
  describe('UpcomingSprintCard', () => {
    test('register for upcoming sprint', async () => {
      vi.mocked(useIsLoggedIn).mockReturnValue(true)
      vi.mocked(getMyUpcomingSprints).mockResolvedValue([])
      const { getByText , findByRole} = render(
        <UpcomingSprintCard
          id={'sprint-1'}
          startTime={new Date()}
          durationSeconds={minutesToSeconds(5)}
          participants={7}
        />,
        { wrapper: wrap(withReactQueryClient()) },
      )
      expect(getByText('5m')).toBeInTheDocument()
      expect(getByText('7')).toBeInTheDocument()
  
      fireEvent.click(await findByRole('button', { name: 'register' }))
      await waitFor(() => {
        expect(registerForPublicSprint).toHaveBeenCalled()
      })
    })

    test('registerd for upcoming sprint', async () => {
      vi.mocked(useIsLoggedIn).mockReturnValue(true)
      vi.mocked(getMyUpcomingSprints).mockResolvedValue([{ id: 'sprint-1' } as Sprint])
      const { findByText } = render(
        <UpcomingSprintCard
          id={'sprint-1'}
          startTime={new Date()}
          durationSeconds={minutesToSeconds(5)}
          participants={1}
        />,
        { wrapper: wrap(withReactQueryClient()) },
      )
      expect(await findByText('registered')).toBeInTheDocument()
    })
  })

  test('PastSprintCard', async () => {
    vi.mocked(getPublicSprintLog).mockResolvedValue([
      {
        participationState: 'completed',
        wordCount: 300,
        userId: 'user-1',
        displayName: 'Alice',
      },
    ])
    const { getByText, container } = render(
      <PastSprintCard id={'sprint-1'} startTime={new Date()} durationSeconds={minutesToSeconds(5)} participants={7} />,
      { wrapper: wrap(withReactQueryClient()) },
    )
    expect(getByText('5m')).toBeInTheDocument()
    expect(getByText('7')).toBeInTheDocument()
    fireEvent.click(getByText('5m'))
    await waitFor(() => {
      expect(container).toHaveTextContent('Alice: 300 words')
    })
  })
})
