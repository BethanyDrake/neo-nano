expect.extend({
  toBeNear(received, target, difference) {
    const { isNot } = this
    const lowerBound = target - difference
    const upperBound = target + difference
    const pass = received > lowerBound && received < upperBound

    return {
      message: () => `expected ${received} ${isNot? 'not' : ''} to be between ${lowerBound} and ${upperBound}`,
      pass
    }
  },
})
