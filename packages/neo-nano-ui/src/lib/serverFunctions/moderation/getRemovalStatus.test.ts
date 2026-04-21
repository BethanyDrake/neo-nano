import { getRemovalStatus } from "./getRemovalStatus"

describe('getRemovalStatus', () => {
    test.each([
        [[], null],
        [[null], 'PENDING_REVIEW'],
        [['overruled' as const], null],
        [['confirmed' as const], 'REMOVED_INAPPROPRIATE'],
        [[null, 'overruled' as const, 'confirmed' as const] , 'REMOVED_INAPPROPRIATE']
    ],
        

    )('removal status $1', (input, removalStatus) => {
        expect(getRemovalStatus(input, false)).toEqual(removalStatus)
    })

    test('deleted by user', () => {
        expect(getRemovalStatus([], true)).toEqual('DELETED')
    })
})