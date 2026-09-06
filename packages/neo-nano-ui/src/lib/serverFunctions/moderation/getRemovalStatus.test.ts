import { getRemovalStatus } from "./getRemovalStatus"

describe('getRemovalStatus', () => {
   
    test('removed inappropriate', () => {
        expect(getRemovalStatus('confirmed_inappropriate', false)).toEqual('REMOVED_INAPPROPRIATE')
    })

     test('pending review inappropriate', () => {
        expect(getRemovalStatus('pending_review', false)).toEqual('PENDING_REVIEW')
    })

    test('deleted by user', () => {
        expect(getRemovalStatus(null, true)).toEqual('DELETED')
    })

    test('not removed', () => {
        expect(getRemovalStatus(null, false)).toEqual(null)
    })
})