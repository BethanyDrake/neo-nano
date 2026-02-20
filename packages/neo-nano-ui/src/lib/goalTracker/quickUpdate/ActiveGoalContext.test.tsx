import { renderHook, waitFor } from '@testing-library/react'
import { ActiveGoalProvider, useActiveGoal } from './ActiveGoalContext'
import { getActiveGoal } from '@/lib/serverFunctions/goals/getActiveGoal'
import { buildGoal } from '@/lib/types/forum.builders'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { useNewAwardModalContext } from '@/lib/awards/NewAwardModal'
import { updateGoalProgress } from '@/lib/serverFunctions/goals/updateGoalProgress'
import { buildUserAward, UserAward } from '@/lib/types/profile.types'
import { dateToChallengeDay } from '@/lib/serverFunctions/goals/goalUtils'
import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn'
import { vi } from 'vitest'
vi.mock('@/lib/serverFunctions/goals/getActiveGoal')
vi.mock('@/lib/awards/NewAwardModal')
vi.mock('@/lib/serverFunctions/goals/updateGoalProgress')
vi.mock('@/lib/serverFunctions/goals/goalUtils')
vi.mock('@/lib/hooks/useIsLoggedIn' )

describe('useActiveGoal', () => {
  beforeEach(() => {
    vi.mocked(useIsLoggedIn).mockReturnValue(true)
  })
  test('returns active goal', async () => {
    const returnedGoal = buildGoal({ title: 'Some Goal' })
    vi.mocked(getActiveGoal).mockResolvedValue(returnedGoal)
    vi.mocked(useNewAwardModalContext).mockReturnValue({
      displayNewAward: vi.fn(),
      isOpen: false,
      closeModal: vi.fn(),
    })

    const Providers = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={new QueryClient()}>
        <ActiveGoalProvider>{children}</ActiveGoalProvider>
      </QueryClientProvider>
    )
    const { result } = renderHook(() => useActiveGoal(), { wrapper: Providers })
    await waitFor(() => {
      expect(result.current.activeGoal).toEqual(returnedGoal)
    })
  })

  test('displays award', async () => {
    const returnedGoal = buildGoal({ title: 'Initial Goal' })
    vi.mocked(getActiveGoal).mockResolvedValue(returnedGoal)
    const displayNewAward = vi.fn()
    vi.mocked(useNewAwardModalContext).mockReturnValue({
      displayNewAward,
      isOpen: false,
      closeModal: vi.fn(),
    })

    const updatedGoal = buildGoal({ title: 'Updated Goal' })
    const award: UserAward = buildUserAward({ title: 'Some Award' })

    vi.mocked(updateGoalProgress).mockResolvedValue({ updatedGoal, claimedAwards: [award] })
    const Providers = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={new QueryClient()}>
        <ActiveGoalProvider>{children}</ActiveGoalProvider>
      </QueryClientProvider>
    )
    const { result } = renderHook(() => useActiveGoal(), { wrapper: Providers })

    await waitFor(() => {
      expect(result.current.isRefreshing).toEqual(false)
    })
    result.current.updateActiveGoal([])
    await waitFor(() => {
      expect(displayNewAward).toHaveBeenCalledWith(award)
    })
  })

  test('updates active goal', async () => {
    const returnedGoal = buildGoal({ id: 'goal-id', title: 'Initial Goal', records: [null] })
    vi.mocked(getActiveGoal).mockResolvedValue(returnedGoal)
    const displayNewAward = vi.fn()
    vi.mocked(useNewAwardModalContext).mockReturnValue({
      displayNewAward,
      isOpen: false,
      closeModal: vi.fn(),
    })

    const updatedGoal = buildGoal({ title: 'Updated Goal' })

    vi.mocked(updateGoalProgress).mockResolvedValue({ updatedGoal, claimedAwards: [] })
    const Providers = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={new QueryClient()}>
        <ActiveGoalProvider>{children}</ActiveGoalProvider>
      </QueryClientProvider>
    )
    const { result } = renderHook(() => useActiveGoal(), { wrapper: Providers })

    await waitFor(() => {
      expect(result.current.isRefreshing).toEqual(false)
    })

    result.current.updateActiveGoal([77])
    await waitFor(() => {
      expect(updateGoalProgress).toHaveBeenCalledWith({id: 'goal-id', records: [77]})
    })

    await waitFor(() => {
      expect(result.current.activeGoal).toEqual(updatedGoal)
    })
  })

  test('add todays total', async () => {
    const returnedGoal = buildGoal({ id: 'goal-id', title: 'Initial Goal', records: [100, 100, 100] })
    vi.mocked(dateToChallengeDay).mockReturnValue(1)
    vi.mocked(getActiveGoal).mockResolvedValue(returnedGoal)
    const displayNewAward = vi.fn()
    vi.mocked(useNewAwardModalContext).mockReturnValue({
      displayNewAward,
      isOpen: false,
      closeModal: vi.fn(),
    })

    const updatedGoal = buildGoal({ title: 'Updated Goal' })

    vi.mocked(updateGoalProgress).mockResolvedValue({ updatedGoal, claimedAwards: [] })
    const Providers = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={new QueryClient()}>
        <ActiveGoalProvider>{children}</ActiveGoalProvider>
      </QueryClientProvider>
    )
    const { result } = renderHook(() => useActiveGoal(), { wrapper: Providers })

    await waitFor(() => {
      expect(result.current.isRefreshing).toEqual(false)
    })

    result.current.addToTodaysTotal(50)
    await waitFor(() => {
      expect(updateGoalProgress).toHaveBeenCalledWith({id: 'goal-id', records: [100, 150, 100]})
    })

  })
})
