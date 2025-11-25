import { fireEvent, render, waitFor } from '@testing-library/react'
import { QuickUpdateModal } from './QuickUpdateModal'
import { useActiveGoal } from './ActiveGoalContext'
import { Goal } from '@/lib/types/forum.types'
import { subDays } from 'date-fns'
import { getDateAsString } from '@/lib/misc'
jest.mock('./ActiveGoalContext')

const today = getDateAsString(new Date())
const yesterday = getDateAsString(subDays(new Date(), 1))
describe('<QuickUpdateModal/>', () => {
  describe('initial state', () => {
     test('middle day, with later days filled', () => {
        const updateActiveGoal = jest.fn()
        jest.mocked(useActiveGoal).mockReturnValue({
          activeGoal: { records: [100, 200, 400], startDate: yesterday } as Goal,
          updateActiveGoal,
            isRefreshing: false,
        refresh: jest.fn()
        })
        const { getByRole } = render(<QuickUpdateModal />)

        fireEvent.click(getByRole('button'))

        expect(getByRole('spinbutton', { name: /today/i })).toHaveValue(200)
        fireEvent.click(getByRole('switch'))
        expect(getByRole('spinbutton', { name: /total/i })).toHaveValue(300)


      })
  })

  describe('per day', () => {
    test('first day', async () => {
      const updateActiveGoal = jest.fn()
      jest.mocked(useActiveGoal).mockReturnValue({
        activeGoal: { records: [0], startDate: today } as Goal,
        updateActiveGoal,
          isRefreshing: false,
        refresh: jest.fn()
      })
      const { getByRole } = render(<QuickUpdateModal />)
      fireEvent.click(getByRole('button'), {name: /quick update/i})
      fireEvent.input(getByRole('spinbutton', { name: /today/i }), { target: { value: '100' } })
      fireEvent.click(getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(updateActiveGoal).toHaveBeenCalledWith([100] )
      })
    })

    test('second day', async () => {
      const updateActiveGoal = jest.fn()
      jest.mocked(useActiveGoal).mockReturnValue({
        activeGoal: { records: [100, 0], startDate: yesterday } as Goal,
        updateActiveGoal,
        isRefreshing: false,
        refresh: jest.fn()
      })
      const { getByRole } = render(<QuickUpdateModal />)
      fireEvent.click(getByRole('button'))
      fireEvent.input(getByRole('spinbutton', { name: /today/i }), { target: { value: '50' } })
      fireEvent.click(getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(updateActiveGoal).toHaveBeenCalledWith([100, 50])
      })
    })

    describe('cumulative', () => {

     
      test('first day', async () => {
        const updateActiveGoal = jest.fn()
        jest.mocked(useActiveGoal).mockReturnValue({
          activeGoal: { records: [0], startDate: today } as Goal,
          updateActiveGoal,
          isRefreshing: false,
          refresh: jest.fn()
        })
        const { getByRole } = render(<QuickUpdateModal />)

        fireEvent.click(getByRole('button'))
        fireEvent.click(getByRole('switch'))
        fireEvent.input(getByRole('spinbutton', { name: /total/i }), { target: { value: '100' } })
        fireEvent.click(getByRole('button', { name: /save/i }))

        await waitFor(() => {
          expect(updateActiveGoal).toHaveBeenCalledWith( [100])
        })
      })

      test('second day', async () => {
        const updateActiveGoal = jest.fn()
        jest.mocked(useActiveGoal).mockReturnValue({
          activeGoal: {
            records: [100, 0],
            startDate: yesterday,
          } as Goal,
          updateActiveGoal,
            isRefreshing: false,
        refresh: jest.fn()
        })
        const { getByRole } = render(<QuickUpdateModal />)
        fireEvent.click(getByRole('button'))
        fireEvent.click(getByRole('switch'))
        fireEvent.input(getByRole('spinbutton', { name: /total/i }), { target: { value: '150' } })
        fireEvent.click(getByRole('button', { name: /save/i }))

        await waitFor(() => {
          expect(updateActiveGoal).toHaveBeenCalledWith( [100, 50])
        })
      })


       test('second day, total word count went down', async () => {
        const updateActiveGoal = jest.fn()
        jest.mocked(useActiveGoal).mockReturnValue({
          activeGoal: {
            records: [100, 0],
            startDate: yesterday,
          } as Goal,
          updateActiveGoal,
            isRefreshing: false,
        refresh: jest.fn()
        })
        const { getByRole } = render(<QuickUpdateModal />)
        fireEvent.click(getByRole('button'))
        fireEvent.click(getByRole('switch'))
        fireEvent.input(getByRole('spinbutton', { name: /total/i }), { target: { value: '50' } })
        fireEvent.click(getByRole('button', { name: /save/i }))

        await waitFor(() => {
          expect(updateActiveGoal).toHaveBeenCalledWith([100, -50])
        })
      })
    })
  })
})
