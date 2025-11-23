import { averageRecords } from "./averageRecords"

describe('averageRecords()', () => {
    it('2 users, 3 days', () => {
        expect(averageRecords([
            [100, 100, 0],
            [100, 200, 1000]

        ])).toEqual([100, 150, 500])
    })

        it('5 users, 1 day', () => {
        expect(averageRecords([
            [0,],
            [0],
            [100],
            [100],
            [50]

        ])).toEqual([50])
    })
})