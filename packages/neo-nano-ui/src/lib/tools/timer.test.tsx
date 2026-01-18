import { render } from "@testing-library/react"
import { Timer_Finished } from "./timer"
import { buildGoal } from "../types/forum.builders"
import { useStopwatch } from "react-timer-hook"
jest.mock('react-timer-hook')

describe('timer', () => {
  describe('finished state', () => {
    test('no active goal', () => {
           // @ts-expect-error test
      jest.mocked(useStopwatch).mockReturnValue({minutes: 0})
      const {getAllByRole, getByRole} = render(<Timer_Finished targetTime={0} onReset={jest.fn() } onRepeat={jest.fn() } />)

      expect (getByRole('button', {name: 'Repeat'})).toBeInTheDocument()
            expect (getByRole('button', {name: 'New target'})).toBeInTheDocument()
      expect (getAllByRole('button')).toHaveLength(2)
    })

     test('add target time to active goal', () => {

      // @ts-expect-error test
      jest.mocked(useStopwatch).mockReturnValue({minutes: 0})
      const {getAllByRole, getByRole} = render(<Timer_Finished targetTime={600} onReset={jest.fn() } onRepeat={jest.fn() } activeGoal={
        buildGoal({id: 'someId'})}/>)
      expect (getByRole('button', {name: "Add 10 minutes to today's goal"})).toBeInTheDocument()
      expect (getAllByRole('button')).toHaveLength(3)
    })

    test('add extra time to active goal', () => {
       // @ts-expect-error test
      jest.mocked(useStopwatch).mockReturnValue({minutes: 5})
      const {getAllByRole, getByRole} = render(<Timer_Finished targetTime={600} onReset={jest.fn() } onRepeat={jest.fn() } activeGoal={
        buildGoal({id: 'someId'})}/>)
           expect (getByRole('button', {name: "Add 15 minutes to today's goal"})).toBeInTheDocument()
      expect (getAllByRole('button')).toHaveLength(4)
    })
  })
})