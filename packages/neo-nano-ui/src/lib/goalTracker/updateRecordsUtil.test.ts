import { updateRecordsUtil } from './updateRecordsUtil'

describe('updateRecordsUtil()', () => {
  describe('cumulative', () => {
    test('various', () => {
      expect(updateRecordsUtil(0, 100, [0], true)).toEqual([100])
      expect(updateRecordsUtil(0, 100, [0, 0], true)).toEqual([100, 0])
      expect(updateRecordsUtil(1, 200, [100, 0], true)).toEqual([100, 100])
      expect(updateRecordsUtil(0, 200, [100, 0], true)).toEqual([200, 0])
    })
})
})
