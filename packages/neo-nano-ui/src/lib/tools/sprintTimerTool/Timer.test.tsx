import { fireEvent, render, waitFor, act } from '@testing-library/react'
import { Timer, Timer_Finished } from './Timer'
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
import { vi } from 'vitest'
vi.mock('@/lib/goalTracker/quickUpdate/ActiveGoalContext', () => ({ useActiveGoal: vi.fn().mockReturnValue({}) }))
vi.mock('react-timer-hook')
vi.mock('@/lib/hooks/useIsLoggedIn')
vi.mock('@/lib/serverFunctions/sprints/recordPrivateSprint')
vi.mock('canvas-confetti')

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
      vi.mocked(useIsLoggedIn).mockReturnValue(true)
    })
    it('shows saved sprint log', async () => {
      // @ts-expect-error test
      vi.mocked(useTimer).mockReturnValue({})
      vi
        .mocked(getMySprintLog)
        .mockResolvedValueOnce([buildCompletedSprint({ id: 'some-id', durationSeconds: 2 * 60, wordCount: 50 })])
      const { findByText } = render(<Timer />)

      expect(await findByText('50 words'))
      expect(await findByText('25.0 w/m'))
    })

    test('finish a 1 minute sprint', async () => {
      let _onExpire
      // @ts-expect-error test
      vi.mocked(useTimer).mockImplementation(({ onExpire }) => {
        _onExpire = onExpire
        return {}
      })
      // @ts-expect-error test
      vi.mocked(useStopwatch).mockReturnValue({ minutes: 0, seconds: 0 })
      vi.mocked(createPrivateSprint).mockResolvedValue(buildSprint({ id: '1' }))
      vi.mocked(getMySprintLog).mockResolvedValueOnce([])
      vi
        .mocked(getMySprintLog)
        .mockResolvedValueOnce([buildCompletedSprint({ id: '1', durationSeconds: 60, wordCount: 50 })])
      const { getByRole, findByText, getByText } = render(<Timer />)

      expect(getByText('Start a timer'))
      const input = getByRole('spinbutton', { name: 'minutes' })
      fireEvent.input(input, { target: { value: 1 } })
      fireEvent.click(getByRole('button', { name: 'Start' }))
      expect(await findByText('The clock is ticking...'))
      act(() => {
        _onExpire!()
      })
      expect(await findByText('Complete!'))

      const wordCountInput = getByRole('spinbutton', { name: 'words' })
      fireEvent.input(wordCountInput, { target: { value: 50 } })
      fireEvent.click(getByRole('button', { name: 'Submit' }))

      expect(await findByText('1m'))
      expect(await findByText('50 words'))
      expect(await findByText('50.0 w/m'))
    })

        describe('Timer_Finished', () => {
      test('update active wordcount goal', async () => {
        const addToTodaysTotal = vi.fn()

        vi
          .mocked(useActiveGoal)
          // @ts-expect-error test
          .mockReturnValue({ activeGoal: buildGoal({ title: 'Goal', metric: 'words' }), addToTodaysTotal })
        // @ts-expect-error test
        vi.mocked(useStopwatch).mockReturnValue({})

        const { getByRole } = render(
          <Timer_Finished targetTime={0} onReset={vi.fn()} onRepeat={vi.fn()} onSubmitWordCount={vi.fn()} />,
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
        const addToTodaysTotal = vi.fn()
        vi
          .mocked(useActiveGoal)
          // @ts-expect-error test
          .mockReturnValue({ activeGoal: buildGoal({ title: 'Goal', metric: 'minutes' }), addToTodaysTotal })
        // @ts-expect-error test
        vi.mocked(useStopwatch).mockReturnValue({})

        const { getByRole } = render(
          <Timer_Finished targetTime={7 * 60} onReset={vi.fn()} onRepeat={vi.fn()} onSubmitWordCount={vi.fn()} />,
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
        const addToTodaysTotal = vi.fn()
        vi
          .mocked(useActiveGoal)
          // @ts-expect-error test
          .mockReturnValue({ activeGoal: buildGoal({ title: 'Goal', metric: 'minutes' }), addToTodaysTotal })
        // @ts-expect-error test
        vi.mocked(useStopwatch).mockReturnValue({ minutes: 10, totalSeconds: 10 * 60 })

        const { getByRole } = render(
          <Timer_Finished targetTime={7 * 60} onReset={vi.fn()} onRepeat={vi.fn()} onSubmitWordCount={vi.fn()} />,
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
      vi.mocked(useIsLoggedIn).mockReturnValue(false)
    })

    test('start a 5 minute timer, then cancel it', async () => {
      // @ts-expect-error test
      vi.mocked(useTimer).mockReturnValue({ minutes: 5, seconds: 30 })
      const { getByRole, findByText, getByText } = render(<Timer />)

      expect(getByText('Start a timer'))
      const input = getByRole('spinbutton', { name: 'minutes' })
      fireEvent.input(input, { target: { value: 5 } })
      fireEvent.click(getByRole('button', { name: 'Start' }))
      expect(await findByText('The clock is ticking...'))
      expect(getByText('5m 30s'))
      fireEvent.click(getByRole('button', { name: 'Cancel' }))
      expect(getByText('Start a timer'))
    })

    test('finish a 1 minute sprint', async () => {
      let _onExpire
      // @ts-expect-error test
      vi.mocked(useTimer).mockImplementation(({ onExpire }) => {
        _onExpire = onExpire
        return {}
      })
      // @ts-expect-error test
      vi.mocked(useStopwatch).mockReturnValue({ minutes: 0, seconds: 0 })
      const { getByRole, findByText, getByText } = render(<Timer />)

      expect(getByText('Start a timer'))
      const input = getByRole('spinbutton', { name: 'minutes' })
      fireEvent.input(input, { target: { value: 1 } })
      fireEvent.click(getByRole('button', { name: 'Start' }))
      expect(await findByText('The clock is ticking...'))
      act(() => {
        _onExpire!()
      })
      expect(await findByText('Complete!'))

      const wordCountInput = getByRole('spinbutton', { name: 'words' })
      fireEvent.input(wordCountInput, { target: { value: 50 } })
      fireEvent.click(getByRole('button', { name: 'Submit' }))

      expect(await findByText('1m'))
      expect(await findByText('50 words'))
      expect(await findByText('50.0 w/m'))
    })


  })
})
