import { assessWordCountAward, WordCountAwardAssessmentInput } from './assessWordCountAward'

describe('assessWordCountAward', () => {
  it('returns false if goal is not of type wordCount', () => {
    const goal = {} as WordCountAwardAssessmentInput['goal']

    const award = {
      requirementUnit: 'days',
    } as WordCountAwardAssessmentInput['award']
    expect(assessWordCountAward({ award, goal })).toEqual(false)
  })

  describe('when the goal aligns exactly with the award dates', () => {
    test('meets requirement', () => {
      const goal: WordCountAwardAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 3,
        records: [100, 100, 100],
      }

      const award: WordCountAwardAssessmentInput['award'] = {
        startDate: '2000-01-01',
        endDate: '2000-01-03',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(true)
    })

    test('does NOT meet the requirement', () => {
      const goal: WordCountAwardAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 3,
        records: [100, 100, 0],
      }

      const award: WordCountAwardAssessmentInput['award'] = {
        startDate: '2000-01-01',
        endDate: '2000-01-03',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(false)
    })
  })

  describe('when the goal fully overlaps the award dates', () => {
    test('meets requirement', () => {
      const goal: WordCountAwardAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 5,
        records: [100, 100, 100, 100, 100],
      }

      const award: WordCountAwardAssessmentInput['award'] = {
        startDate: '2000-01-02',
        endDate: '2000-01-04',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(true)
    })

    test('does NOT meet the requirement', () => {
      const goal: WordCountAwardAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 5,
        records: [100, 100, 100, 0, 100],
      }

      const award: WordCountAwardAssessmentInput['award'] = {
        startDate: '2000-01-02',
        endDate: '2000-01-04',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(false)
    })
  })

  describe('when goal started before the start date', () => {
    test('meets requirement', () => {
      const goal: WordCountAwardAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 3,
        records: [100, 100, 400],
      }

      const award: WordCountAwardAssessmentInput['award'] = {
        startDate: '2000-01-03',
        endDate: '2000-01-03',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(true)
    })

    test('does NOT meet the requirement', () => {
      const goal: WordCountAwardAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 3,
        records: [100, 100, 100],
      }

      const award: WordCountAwardAssessmentInput['award'] = {
        startDate: '2000-01-03',
        endDate: '2000-01-03',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(false)
    })
  })

  describe('when goal started after the start date', () => {
    test('meets requirement', () => {
      const goal: WordCountAwardAssessmentInput['goal'] = {
        startDate: '2000-01-02',
        lengthDays: 3,
        records: [100, 200, 0],
      }

      //award started 1 day before the goal
      //award ended on day 2 of the goal
      const award: WordCountAwardAssessmentInput['award'] = {
        startDate: '2000-01-01',
        endDate: '2000-01-03',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(true)
    })

    test('does NOT meet the requirement', () => {
      const goal: WordCountAwardAssessmentInput['goal'] = {
        startDate: '2000-01-02',
        lengthDays: 3,
        records: [100, 100, 100],
      }

      const award: WordCountAwardAssessmentInput['award'] = {
        startDate: '2000-01-03',
        endDate: '2000-01-03',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(false)
    })
  })

  describe('when goal ended before the start date', () => {
    test('does NOT meet the requirement', () => {
      const goal: WordCountAwardAssessmentInput['goal'] = {
        startDate: '1999-01-01',
        lengthDays: 3,
        records: [4000, 4000, 4000],
      }

      const award: WordCountAwardAssessmentInput['award'] = {
        startDate: '2000-01-01',
        endDate: '2000-01-03',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(false)
    })
  })

  describe('when goal started after the award end date', () => {
    test('does NOT meet the requirement', () => {
      const goal: WordCountAwardAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 3,
        records: [100, 100, 100],
      }

      const award: WordCountAwardAssessmentInput['award'] = {
        startDate: '1999-01-01',
        endDate: '1999-01-03',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(false)
    })
  })
})
