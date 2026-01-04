import { assessMinutesAward, GoalAssessmentInput } from './assessAwards'

describe('assessMinutesAward', () => {
  test('goal is not time-based', () => {
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
    expect(assessMinutesAward({ award, goal })).toEqual(false)
  })

  test('dates overlap exactly', () => {
    const goal: GoalAssessmentInput['goal'] = {
      startDate: '2000-01-01',
      lengthDays: 3,
      records: [100, 100, 100],
      metric: 'minutes',
    }

    const award: GoalAssessmentInput['award'] = {
      startDate: '2000-01-01',
      endDate: '2000-01-03',
      requirementUnit: 'minutes',
      requirementValue: 300,
    }
    expect(assessMinutesAward({ award, goal })).toEqual(true)
  })
})
