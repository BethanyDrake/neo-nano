import {
  completePublicSprint,
  getMyUpcomingSprints,
  getPublicSprintLog,
} from '@/lib/serverFunctions/sprints/publicSprint'
import { LiveSprintModal } from './LiveSprintModal'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { withReactQueryClient } from '@/tests/utils/withReactQueryClient'
import { wrap } from 'souvlaki'
import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn'

vi.mock('@/lib/serverFunctions/sprints/publicSprint')
vi.mock('@/lib/hooks/useIsLoggedIn')

describe('LiveSprintModal', () => {
  test('Alice and Bob both register, only Alice submits a wordcount', async () => {
    vi.mocked(getMyUpcomingSprints).mockResolvedValue([
      { id: '123', durationSeconds: 1, startTime: new Date(), visibility: 'public' },
    ])
    vi.mocked(useIsLoggedIn).mockReturnValue(true)
    vi.mocked(getPublicSprintLog).mockResolvedValue([
      { userId: '1', displayName: 'Alice', wordCount: 100, participationState: 'completed' },
      { userId: '2', displayName: 'Bob', wordCount: null, participationState: 'registered' },
    ])
    const { findByText, getByRole, container, getByText } = render(<LiveSprintModal />, {
      wrapper: wrap(withReactQueryClient()),
    })
    expect(await findByText('Sprint!')).toBeInTheDocument()
    expect(await findByText('Done!')).toBeInTheDocument()
    fireEvent.input(getByRole('spinbutton', { name: 'Enter word count:' }), { target: { value: '100' } })
    fireEvent.click(getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(completePublicSprint).toHaveBeenCalledWith('123', 100)
    })

    await waitFor(() => {
      expect(container.textContent).toContain('Alice: 100')
    })

    expect(getByText('Bob')).toBeInTheDocument()
  })
})
