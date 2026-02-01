import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn'
import { getDateAsString } from '@/lib/misc'
import { ModalContextProvider } from '@/lib/modals/ModalContext'
import { getActiveGoal } from '@/lib/serverFunctions/goals/getActiveGoal'
import { updateGoalProgress } from '@/lib/serverFunctions/goals/updateGoalProgress'
import { buildGoal } from '@/lib/types/forum.builders'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { subDays } from 'date-fns'
import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { ActiveGoalProvider } from './ActiveGoalContext'
import { QuickUpdateModal } from './QuickUpdateModal'
jest.mock('next/navigation')
jest.mock('@/lib/serverFunctions/goals/updateGoalProgress')
jest.mock('@/lib/serverFunctions/goals/getActiveGoal')
jest.mock('@/lib/hooks/useIsLoggedIn')

const today = getDateAsString(new Date())
const yesterday = getDateAsString(subDays(new Date(), 1))

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ActiveGoalProvider>
        <ModalContextProvider>{children}</ModalContextProvider>
      </ActiveGoalProvider>
    </QueryClientProvider>
  )
}
describe('<QuickUpdateModal/>', () => {
  beforeEach(() => {
    jest.mocked(usePathname).mockReturnValue('')
    jest.mocked(useIsLoggedIn).mockReturnValue(true)
  })

  test('disabled on profile page', () => {
    jest.mocked(getActiveGoal).mockResolvedValue(buildGoal())
    jest.mocked(usePathname).mockReturnValue('/profile')
    const { getByRole } = render(<QuickUpdateModal />, { wrapper: Providers })
    const button = getByRole('button', { name: 'Quick Update' })
    expect(button).toBeDisabled()
  })

  test('disabled when there is no active goal', () => {
    jest.mocked(getActiveGoal).mockResolvedValue(null)
    const { getByRole } = render(<QuickUpdateModal />, { wrapper: Providers })
    const button = getByRole('button', { name: 'Quick Update' })
    expect(button).toBeDisabled()
  })

  describe('initial state', () => {
    test('middle day, with later days filled', async () => {
      jest
        .mocked(getActiveGoal)
        .mockResolvedValue(buildGoal({ id: 'goal-id', records: [100, 200, 400], startDate: yesterday }))
      const { getByRole } = render(<QuickUpdateModal />, { wrapper: Providers })

      await waitFor(() => {
        expect(getByRole('button', { name: 'Quick Update' })).toBeEnabled()
      })
      fireEvent.click(getByRole('button'))

      expect(getByRole('spinbutton', { name: /today/i })).toHaveValue(200)
      fireEvent.click(getByRole('switch'))
      expect(getByRole('spinbutton', { name: /total/i })).toHaveValue(300)
    })
  })

  describe('per day', () => {
    test('shows goal metric', async () => {
      jest
        .mocked(getActiveGoal)
        .mockResolvedValue(buildGoal({ id: 'goal-id', metric: 'words', records: [null], startDate: today }))

      const { getByRole, getByText } = render(<QuickUpdateModal />, { wrapper: Providers })
      await waitFor(() => {
        expect(getByRole('button', { name: 'Quick Update' })).toBeEnabled()
      })
      fireEvent.click(getByRole('button'))
      expect(getByText('words')).toBeInTheDocument()
    })
    test('first day', async () => {
      jest.mocked(getActiveGoal).mockResolvedValue(buildGoal({ id: 'goal-id', records: [0], startDate: today }))

      const { getByRole } = render(<QuickUpdateModal />, { wrapper: Providers })
      await waitFor(() => {
        expect(getByRole('button', { name: 'Quick Update' })).toBeEnabled()
      })
      fireEvent.click(getByRole('button'), { name: /quick update/i })
      fireEvent.input(getByRole('spinbutton', { name: /today/i }), { target: { value: '100' } })
      fireEvent.click(getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(updateGoalProgress).toHaveBeenCalledWith({ id: 'goal-id', records: [100] })
      })
    })

    test('second day', async () => {
      jest
        .mocked(getActiveGoal)
        .mockResolvedValue(buildGoal({ id: 'goal-id', records: [100, 0], startDate: yesterday }))

      const { getByRole } = render(<QuickUpdateModal />, { wrapper: Providers })
      await waitFor(() => {
        expect(getByRole('button', { name: 'Quick Update' })).toBeEnabled()
      })
      fireEvent.click(getByRole('button'))
      fireEvent.input(getByRole('spinbutton', { name: /today/i }), { target: { value: '50' } })
      fireEvent.click(getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(updateGoalProgress).toHaveBeenCalledWith({ id: 'goal-id', records: [100, 50] })
      })
    })
  })
  describe('cumulative', () => {
    it('shows goal metric', async () => {
      jest
        .mocked(getActiveGoal)
        .mockResolvedValue(buildGoal({ id: 'goal-id', records: [null], metric: 'minutes', startDate: today }))
      const { getByRole, getByText } = render(<QuickUpdateModal />, { wrapper: Providers })
      await waitFor(() => {
        expect(getByRole('button', { name: 'Quick Update' })).toBeEnabled()
      })

      fireEvent.click(getByRole('button'))
      fireEvent.click(getByRole('switch'))
      expect(getByText('minutes')).toBeInTheDocument()
    })
    test('first day', async () => {
      jest.mocked(getActiveGoal).mockResolvedValue(buildGoal({ id: 'goal-id', records: [0], startDate: today }))
      const { getByRole } = render(<QuickUpdateModal />, { wrapper: Providers })

      await waitFor(() => {
        expect(getByRole('button', { name: 'Quick Update' })).toBeEnabled()
      })
      fireEvent.click(getByRole('button', { name: 'Quick Update' }))
      fireEvent.click(getByRole('switch'))
      fireEvent.input(getByRole('spinbutton', { name: /total/i }), { target: { value: '100' } })
      fireEvent.click(getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(updateGoalProgress).toHaveBeenCalledWith({ id: 'goal-id', records: [100] })
      })
    })

    test('second day', async () => {
      jest
        .mocked(getActiveGoal)
        .mockResolvedValue(buildGoal({ id: 'goal-id', records: [100, 0], startDate: yesterday }))
      const { getByRole } = render(<QuickUpdateModal />, { wrapper: Providers })

      await waitFor(() => {
        expect(getByRole('button', { name: 'Quick Update' })).toBeEnabled()
      })

      fireEvent.click(getByRole('button'))
      fireEvent.click(getByRole('switch'))
      fireEvent.input(getByRole('spinbutton', { name: /total/i }), { target: { value: '150' } })
      fireEvent.click(getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(updateGoalProgress).toHaveBeenCalledWith({ id: 'goal-id', records: [100, 50] })
      })
    })

    test('second day, total word count went down', async () => {
      jest
        .mocked(getActiveGoal)
        .mockResolvedValue(buildGoal({ id: 'goal-id', records: [100, 0], startDate: yesterday }))
      const { getByRole } = render(<QuickUpdateModal />, { wrapper: Providers })
      await waitFor(() => {
        expect(getByRole('button', { name: 'Quick Update' })).toBeEnabled()
      })

      fireEvent.click(getByRole('button'))
      fireEvent.click(getByRole('switch'))
      fireEvent.input(getByRole('spinbutton', { name: /total/i }), { target: { value: '50' } })
      fireEvent.click(getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(updateGoalProgress).toHaveBeenCalledWith({ id: 'goal-id', records: [100, -50] })
      })
    })
  })
})
