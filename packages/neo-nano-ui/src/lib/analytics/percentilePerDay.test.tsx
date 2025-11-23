import { percentilePerDay } from "./percentilePerDay"

describe('percentilePerdat()', () => {
    test('median of 3 users', () => {
        expect(percentilePerDay([
            [0, 0],
            [100,0],
            [200,500]

        ], 50)).toEqual([100, 0])
    })

    test('75th percentile of 4 users', () => {
        expect(percentilePerDay([
            [0,],
            [100,],
            [200],
            [300]

        ], 75)).toEqual([200])
    })
    test('99th percentile of 4 users', () => {
        expect(percentilePerDay([
            [0,],
            [100,],
            [200],
            [300]

        ], 99)).toEqual([300])
    })
})