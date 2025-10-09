import { changeAtIndex, toCumulative, toPerDay } from "./recordUtils"

describe('recordUtils', () => {
    describe('toCumulative', () => {
        test('empty array', () => {
            expect(toCumulative([])).toEqual([])
        })

        test('null array', () => {
            expect(toCumulative([null, null, null])).toEqual([null, null, null])
        })

        test('with values', () => {
            expect(toCumulative([10, 100, 80])).toEqual([10, 110, 190])
        })

         test('with missed days', () => {
            expect(toCumulative([10, null, 100])).toEqual([10, 10, 110])
        })
    })

    describe('toPerDay', () => {
        test('empty array', () => {
            expect(toPerDay([])).toEqual([])
        })

        test('zero array', () => {
            expect(toPerDay([0, 0, 0])).toEqual([null, null, null])
        })

        test('with values', () => {
            expect(toPerDay([10, 110, 190])).toEqual([10, 100, 80])
        })

        test('with missed daysvalues', () => {
            expect(toPerDay([10, 10, 110])).toEqual([10, null, 100])
        })
    })

    describe('changeAtIndex', () => {
        test('first', () => {
            expect(changeAtIndex([0,0], 0, 100)).toEqual([100, 0])
        })

         test('middle', () => {
            expect(changeAtIndex([1,2,3,4], 2, 30)).toEqual([1,2,30, 4])
        })
    })
})