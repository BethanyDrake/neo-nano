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

  test('negative challenge end date', () => {
    const goal: GoalAssessmentInput['goal'] = {
        startDate: '2026-02-28',
        lengthDays: 100,
        records: [1041,191,1165,843,735,741,756,859,1020,1088,345,729,742,250,983,200,606,816,421,28,1178,759,289,1070,0,47,1030,1208,1022,null,814,null,1025,751,null,820,179,149,712,471,928,510,457,null,null,460,670,835,740,882,857,980,813,0,644,882,227,601,758,1055,33,335,759,1275,895,null,394,453,null,null,440,643,null,736,534,841,513,1122,702,336,null,613,102,null,487,null,750,null,716,null,null,null,262,152,265,687,376,501,null,null,890,282,671,282,705,560,658,507,533,402,245],
        metric: 'words',
      }

      const award: GoalAssessmentInput['award'] = {
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        requirementUnit: 'words',
        requirementValue: 10000,
      }
     expect(assessWordCountAward({ award, goal })).toEqual(false)
  })
})
