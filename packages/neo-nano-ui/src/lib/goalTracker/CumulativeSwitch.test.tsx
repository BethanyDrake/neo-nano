import { fireEvent, render } from "@testing-library/react"
import { CumulativeSwitch } from "./CumulativeSwitch"
import { vi } from 'vitest'

describe('cumulative switch', () => {
    it('persists preference in local storage', () => {
        const setIsCumulative = vi.fn()
        const {getByRole} = render(<CumulativeSwitch metric="words" isCumulative={false} setIsCumulative={setIsCumulative}/>)
        fireEvent.click(getByRole('switch'))
        expect(window.localStorage.getItem('isCumulative')).toEqual('true')
        expect(setIsCumulative).toHaveBeenCalledWith(true)
    })

    test('per day metric', () => {
        const {getByText} = render(<CumulativeSwitch metric="minutes" isCumulative={false} setIsCumulative={vi.fn()}/>)
        expect(getByText(/Minutes Per Day/i))
    })

    it('defaults to value in local storage (true)', () => {
        const setIsCumulative = vi.fn()
        window.localStorage.setItem('isCumulative', 'true')
        render(<CumulativeSwitch metric="words"  isCumulative={false} setIsCumulative={setIsCumulative}/>)
        expect(setIsCumulative).toHaveBeenCalledWith(true)
    })

     it('defaults to value in local storage (false', () => {
        const setIsCumulative = vi.fn()
        window.localStorage.setItem('isCumulative', 'false')
        render(<CumulativeSwitch metric="words" isCumulative={false} setIsCumulative={setIsCumulative}/>)
        expect(setIsCumulative).toHaveBeenCalledWith(false)
    })
})