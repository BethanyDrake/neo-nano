import { assessWordCountAward, GoalAssessmentInput } from './assessAwards'

describe('assessWordCountAward', () => {
  it('returns false if GOAL is not of type wordCount', () => {
    const goal: GoalAssessmentInput['goal'] = {
      startDate: '2000-01-01',
      lengthDays: 3,
      records: [100, 100, 100],
      metric: 'minutes',
    }

    const award: GoalAssessmentInput['award'] = {
      startDate: '2000-01-01',
      endDate: '2000-01-03',
      requirementUnit: 'words',
      requirementValue: 300,
    }
    expect(assessWordCountAward({ award, goal })).toEqual(false)
  })

  it('returns false if award is not of type wordCount', () => {
    const goal: GoalAssessmentInput['goal'] = {
      startDate: '2000-01-01',
      lengthDays: 3,
      records: [100, 100, 100],
      metric: 'words',
    }

    const award: GoalAssessmentInput['award'] = {
      startDate: '2000-01-01',
      endDate: '2000-01-03',
      requirementUnit: 'minutes',
      requirementValue: 300,
    }
    expect(assessWordCountAward({ award, goal })).toEqual(false)
  })

  describe('when the goal aligns exactly with the award dates', () => {
    test('meets requirement', () => {
      const goal: GoalAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 3,
        records: [100, 100, 100],
        metric: 'words',
      }

      const award: GoalAssessmentInput['award'] = {
        startDate: '2000-01-01',
        endDate: '2000-01-03',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(true)
    })

    test('does NOT meet the requirement', () => {
      const goal: GoalAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 3,
        records: [100, 100, 0],
        metric: 'words',
      }

      const award: GoalAssessmentInput['award'] = {
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
      const goal: GoalAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 5,
        records: [100, 100, 100, 100, 100],
        metric: 'words',
      }

      const award: GoalAssessmentInput['award'] = {
        startDate: '2000-01-02',
        endDate: '2000-01-04',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(true)
    })

    test('does NOT meet the requirement', () => {
      const goal: GoalAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 5,
        records: [100, 100, 100, 0, 100],
        metric: 'words',
      }

      const award: GoalAssessmentInput['award'] = {
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
      const goal: GoalAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 3,
        records: [100, 100, 400],
        metric: 'words',
      }

      const award: GoalAssessmentInput['award'] = {
        startDate: '2000-01-03',
        endDate: '2000-01-03',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(true)
    })

    test('does NOT meet the requirement', () => {
      const goal: GoalAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 3,
        records: [100, 100, 100],
        metric: 'words',
      }

      const award: GoalAssessmentInput['award'] = {
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
      const goal: GoalAssessmentInput['goal'] = {
        startDate: '2000-01-02',
        lengthDays: 3,
        records: [100, 200, 0],
        metric: 'words',
      }

      //award started 1 day before the goal
      //award ended on day 2 of the goal
      const award: GoalAssessmentInput['award'] = {
        startDate: '2000-01-01',
        endDate: '2000-01-03',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(true)
    })

    test('does NOT meet the requirement', () => {
      const goal: GoalAssessmentInput['goal'] = {
        startDate: '2000-01-02',
        lengthDays: 3,
        records: [100, 100, 100],
        metric: 'words',
      }

      const award: GoalAssessmentInput['award'] = {
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
      const goal: GoalAssessmentInput['goal'] = {
        startDate: '1999-01-01',
        lengthDays: 3,
        records: [4000, 4000, 4000],
        metric: 'words',
      }

      const award: GoalAssessmentInput['award'] = {
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
      const goal: GoalAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 3,
        records: [100, 100, 100],
        metric: 'words',
      }

      const award: GoalAssessmentInput['award'] = {
        startDate: '1999-01-01',
        endDate: '1999-01-03',
        requirementUnit: 'words',
        requirementValue: 300,
      }
      expect(assessWordCountAward({ award, goal })).toEqual(false)
    })
  })
})
