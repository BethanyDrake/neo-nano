import { GoalAssessmentInput, assessConsistencyAward } from './assessAwards'

describe('assessConsistencyAward', () => {
  it('returns false if goal is not of type consistency', () => {
    const goal = {} as GoalAssessmentInput['goal']

    const award = {
      requirementUnit: 'words',
    } as GoalAssessmentInput['award']
    expect(assessConsistencyAward({ award, goal })).toEqual(false)
  })

  describe('perfectly consistent', () => {
    test('meets requirement', () => {
      const goal: GoalAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 3,
        records: [100, 100, 100],
      }

      const award: GoalAssessmentInput['award'] = {
        startDate: '2000-01-01',
        endDate: '2000-01-03',
        requirementUnit: 'days',
        requirementValue: 3,
      }
      expect(assessConsistencyAward({ award, goal })).toEqual(true)
    })

    test('does NOT meet the requirement', () => {
      const goal: GoalAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 3,
        records: [100, 100, 0],
      }

      const award: GoalAssessmentInput['award'] = {
        startDate: '2000-01-01',
        endDate: '2000-01-03',
        requirementUnit: 'days',
        requirementValue: 3,
      }
      expect(assessConsistencyAward({ award, goal })).toEqual(false)
    })
  })

  describe('somewhat consistent', () => {
    test('meets requirement ', () => {
      const goal: GoalAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 7,
        records: [100, 100, 0, 100, 0, 0, 0],
      }

      const award: GoalAssessmentInput['award'] = {
        startDate: '2000-01-01',
        endDate: '2000-01-07',
        requirementUnit: 'days',
        requirementValue: 3,
      }
      expect(assessConsistencyAward({ award, goal })).toEqual(true)
    })
    test('does NOT meet the requirement', () => {
      const goal: GoalAssessmentInput['goal'] = {
        startDate: '2000-01-01',
        lengthDays: 7,
        records: [100, 0, 0, 100, 0, 0, 0],
      }

      const award: GoalAssessmentInput['award'] = {
        startDate: '2000-01-01',
        endDate: '2000-01-07',
        requirementUnit: 'days',
        requirementValue: 3,
      }
      expect(assessConsistencyAward({ award, goal })).toEqual(false)
    })
  })
})
