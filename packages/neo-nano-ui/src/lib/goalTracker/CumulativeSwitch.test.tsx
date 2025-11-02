import { fireEvent, render } from "@testing-library/react"
import { CumulativeSwitch } from "./CumulativeSwitch"

describe('cumulative switch', () => {
    it('persists preference in local storage', () => {
        const setIsCumulative = jest.fn()
        const {getByRole} = render(<CumulativeSwitch isCumulative={false} setIsCumulative={setIsCumulative}/>)
        fireEvent.click(getByRole('switch'))
        expect(window.localStorage.getItem('isCumulative')).toEqual('true')
        expect(setIsCumulative).toHaveBeenCalledWith(true)
    })

    it('defaults to value in local storage (true)', () => {
        const setIsCumulative = jest.fn()
        window.localStorage.setItem('isCumulative', 'true')
        render(<CumulativeSwitch isCumulative={false} setIsCumulative={setIsCumulative}/>)
        expect(setIsCumulative).toHaveBeenCalledWith(true)
    })

     it('defaults to value in local storage (false', () => {
        const setIsCumulative = jest.fn()
        window.localStorage.setItem('isCumulative', 'false')
        render(<CumulativeSwitch isCumulative={false} setIsCumulative={setIsCumulative}/>)
        expect(setIsCumulative).toHaveBeenCalledWith(false)
    })
})