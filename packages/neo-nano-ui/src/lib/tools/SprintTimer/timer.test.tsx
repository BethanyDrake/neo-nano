import { fireEvent, render, waitFor, act } from '@testing-library/react'
import { Timer, Timer_Finished } from './timer'
import { buildGoal } from '@/lib/types/forum.builders'
import { useStopwatch, useTimer } from 'react-timer-hook'
import { useActiveGoal } from '@/lib/goalTracker/quickUpdate/ActiveGoalContext'
import {
  CompletedSprint,
  createPrivateSprint,
  getMySprintLog,
  Sprint,
} from '@/lib/serverFunctions/sprints/recordPrivateSprint'
import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn'
jest.mock('@/lib/goalTracker/quickUpdate/ActiveGoalContext', () => ({ useActiveGoal: jest.fn().mockReturnValue({}) }))
jest.mock('react-timer-hook')
jest.mock('@/lib/hooks/useIsLoggedIn')
jest.mock('@/lib/serverFunctions/sprints/recordPrivateSprint')

const buildSprint = (overrides: Partial<Sprint> = {}): Sprint => {
  return {
    id: 'sprint-id',
    durationSeconds: 0,
    startTime: new Date(),
    visibility: 'private',

    ...overrides,
  }
}

const buildCompletedSprint = (overides: Partial<CompletedSprint> = {}): CompletedSprint => {
  return {
    id: '',
    durationSeconds: 0,
    startTime: new Date(),
    wordCount: 0,
    visibility: 'private',
    participationState: 'completed',
    ...overides,
  }
}

describe('timer', () => {
  describe('loggedInState', () => {
    beforeEach(() => {
      jest.mocked(useIsLoggedIn).mockReturnValue(true)
    })
    it('shows saved sprint log', async () => {
      // @ts-expect-error test
      jest.mocked(useTimer).mockReturnValue({})
      jest
        .mocked(getMySprintLog)
        .mockResolvedValueOnce([buildCompletedSprint({ id: 'some-id', durationSeconds: 2 * 60, wordCount: 50 })])
      const { findByText } = render(<Timer />)

      expect(await findByText('Sprint some-id')).toBeInTheDocument()
      expect(await findByText('50 words')).toBeInTheDocument()
      expect(await findByText('25.0 w/m')).toBeInTheDocument()
    })

    test('finish a 1 minute sprint', async () => {
      let _onExpire
      // @ts-expect-error test
      jest.mocked(useTimer).mockImplementation(({ onExpire }) => {
        _onExpire = onExpire
        return {}
      })
      // @ts-expect-error test
      jest.mocked(useStopwatch).mockReturnValue({ minutes: 0, seconds: 0 })
      jest.mocked(createPrivateSprint).mockResolvedValue(buildSprint({ id: '1' }))
      jest.mocked(getMySprintLog).mockResolvedValueOnce([])
      jest
        .mocked(getMySprintLog)
        .mockResolvedValueOnce([buildCompletedSprint({ id: '1', durationSeconds: 60, wordCount: 50 })])
      const { getByRole, findByText, getByText } = render(<Timer />)

      expect(getByText('Start a timer')).toBeInTheDocument()
      const input = getByRole('spinbutton', { name: 'minutes' })
      fireEvent.input(input, { target: { value: 1 } })
      fireEvent.click(getByRole('button', { name: 'Start' }))
      expect(await findByText('The clock is ticking...')).toBeInTheDocument()
      act(() => {
        _onExpire!()
      })
      expect(await findByText('Complete!')).toBeInTheDocument()

      const wordCountInput = getByRole('spinbutton', { name: 'words' })
      fireEvent.input(wordCountInput, { target: { value: 50 } })
      fireEvent.click(getByRole('button', { name: 'Submit' }))

      expect(await findByText('Sprint 1')).toBeInTheDocument()
      expect(await findByText('1m')).toBeInTheDocument()
      expect(await findByText('50 words')).toBeInTheDocument()
      expect(await findByText('50.0 w/m')).toBeInTheDocument()
    })

        describe('Timer_Finished', () => {
      test('update active wordcount goal', async () => {
        const addToTodaysTotal = jest.fn()

        jest
          .mocked(useActiveGoal)
          // @ts-expect-error test
          .mockReturnValue({ activeGoal: buildGoal({ title: 'Goal', metric: 'words' }), addToTodaysTotal })
        // @ts-expect-error test
        jest.mocked(useStopwatch).mockReturnValue({})

        const { getByRole } = render(
          <Timer_Finished targetTime={0} onReset={jest.fn()} onRepeat={jest.fn()} onSubmitWordCount={jest.fn()} />,
        )

        const wordCountInput = getByRole('spinbutton', { name: 'words' })
        fireEvent.input(wordCountInput, { target: { value: 50 } })
        fireEvent.click(getByRole('checkbox', { name: 'Update Goal' }))
        fireEvent.click(getByRole('button', { name: 'Submit' }))
        await waitFor(() => {
          expect(addToTodaysTotal).toHaveBeenCalledWith(50, expect.anything())
        })
      })

      test('update active timebased goal', async () => {
        const addToTodaysTotal = jest.fn()
        jest
          .mocked(useActiveGoal)
          // @ts-expect-error test
          .mockReturnValue({ activeGoal: buildGoal({ title: 'Goal', metric: 'minutes' }), addToTodaysTotal })
        // @ts-expect-error test
        jest.mocked(useStopwatch).mockReturnValue({})

        const { getByRole } = render(
          <Timer_Finished targetTime={7 * 60} onReset={jest.fn()} onRepeat={jest.fn()} onSubmitWordCount={jest.fn()} />,
        )

        const wordCountInput = getByRole('spinbutton', { name: 'words' })
        fireEvent.input(wordCountInput, { target: { value: 50 } })
        fireEvent.click(getByRole('checkbox', { name: 'Update Goal' }))
        fireEvent.click(getByRole('button', { name: 'Submit' }))
        await waitFor(() => {
          expect(addToTodaysTotal).toHaveBeenCalledWith(7, expect.anything())
        })
      })

      test('include overtime', async () => {
        const addToTodaysTotal = jest.fn()
        jest
          .mocked(useActiveGoal)
          // @ts-expect-error test
          .mockReturnValue({ activeGoal: buildGoal({ title: 'Goal', metric: 'minutes' }), addToTodaysTotal })
        // @ts-expect-error test
        jest.mocked(useStopwatch).mockReturnValue({ minutes: 10, totalSeconds: 10 * 60 })

        const { getByRole } = render(
          <Timer_Finished targetTime={7 * 60} onReset={jest.fn()} onRepeat={jest.fn()} onSubmitWordCount={jest.fn()} />,
        )

        const wordCountInput = getByRole('spinbutton', { name: 'words' })
        fireEvent.input(wordCountInput, { target: { value: 50 } })
        fireEvent.click(getByRole('checkbox', { name: 'Update Goal' }))
        fireEvent.click(getByRole('checkbox', { name: 'Include overtime' }))
        fireEvent.click(getByRole('button', { name: 'Submit' }))
        await waitFor(() => {
          expect(addToTodaysTotal).toHaveBeenCalledWith(17, expect.anything())
        })
      })
    })
  })

  describe('loggedOutState', () => {
    beforeEach(() => {
      jest.mocked(useIsLoggedIn).mockReturnValue(false)
    })

    test('start a 5 minute timer, then cancel it', async () => {
      // @ts-expect-error test
      jest.mocked(useTimer).mockReturnValue({ minutes: 5, seconds: 30 })
      const { getByRole, findByText, getByText } = render(<Timer />)

      expect(getByText('Start a timer')).toBeInTheDocument()
      const input = getByRole('spinbutton', { name: 'minutes' })
      fireEvent.input(input, { target: { value: 5 } })
      fireEvent.click(getByRole('button', { name: 'Start' }))
      expect(await findByText('The clock is ticking...')).toBeInTheDocument()
      expect(getByText('5m 30s')).toBeInTheDocument()
      fireEvent.click(getByRole('button', { name: 'Cancel' }))
      expect(getByText('Start a timer')).toBeInTheDocument()
    })

    test('finish a 1 minute sprint', async () => {
      let _onExpire
      // @ts-expect-error test
      jest.mocked(useTimer).mockImplementation(({ onExpire }) => {
        _onExpire = onExpire
        return {}
      })
      // @ts-expect-error test
      jest.mocked(useStopwatch).mockReturnValue({ minutes: 0, seconds: 0 })
      const { getByRole, findByText, getByText } = render(<Timer />)

      expect(getByText('Start a timer')).toBeInTheDocument()
      const input = getByRole('spinbutton', { name: 'minutes' })
      fireEvent.input(input, { target: { value: 1 } })
      fireEvent.click(getByRole('button', { name: 'Start' }))
      expect(await findByText('The clock is ticking...')).toBeInTheDocument()
      act(() => {
        _onExpire!()
      })
      expect(await findByText('Complete!')).toBeInTheDocument()

      const wordCountInput = getByRole('spinbutton', { name: 'words' })
      fireEvent.input(wordCountInput, { target: { value: 50 } })
      fireEvent.click(getByRole('button', { name: 'Submit' }))

      expect(await findByText('Sprint 1')).toBeInTheDocument()
      expect(await findByText('1m')).toBeInTheDocument()
      expect(await findByText('50 words')).toBeInTheDocument()
      expect(await findByText('50.0 w/m')).toBeInTheDocument()
    })


  })
})
