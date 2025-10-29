import { isActive } from './goalUtils'

describe('goalUtils', () => {
  describe('isActive', () => {
    test('various', () => {
      expect(isActive('2025-11-01', 30, '2025-11-01')).toEqual(true)
      expect(isActive('2025-11-01', 30, '2025-11-30')).toEqual(true)
      expect(isActive('2025-11-01', 30, '2025-11-30')).toEqual(true)

      expect(isActive('2025-11-01', 30, '2025-10-31')).toEqual(false)
      expect(isActive('2025-11-01', 30, '2025-12-1')).toEqual(false)

      expect(isActive('2025-11-01', 1, '2025-11-01')).toEqual(true)
      expect(isActive('2025-11-01', 1, '2025-11-02')).toEqual(false)
    })
  })
})
