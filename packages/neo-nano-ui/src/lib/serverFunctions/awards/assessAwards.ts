import { Goal } from "@/lib/types/forum.types"
import { Award } from "@/lib/types/profile.types"
import _ from 'lodash'
import { dateToChallengeDay } from "../goals/goalUtils"


export type GoalAssessmentInput = {
    award: Pick<Award, 'startDate' | 'endDate' | 'requirementUnit' | 'requirementValue'>,
    goal: Pick<Goal,  'startDate' | 'lengthDays' | 'records'>
}



const getRelevantRecords = ({award, goal}: GoalAssessmentInput) => {
    const startChallengeDay = Math.max(dateToChallengeDay(goal.startDate, award.startDate), 0)
    const endChallengeDay = Math.min(dateToChallengeDay(goal.startDate, award.endDate) + 1, goal.lengthDays)
    return goal.records.slice(startChallengeDay, endChallengeDay)
}

export const assessWordCountAward = ({award, goal}: GoalAssessmentInput): boolean => {
    if (award.requirementUnit !== 'words') {
        return false
    }
    const relevantRecords = getRelevantRecords({award, goal})
    const totalWords = _.sum(relevantRecords)
    return totalWords >= award.requirementValue
}

export const assessMinutesAward = ({award, goal}: GoalAssessmentInput): boolean => {
    if (award.requirementUnit !== 'minutes') {
        return false
    }
    const relevantRecords = getRelevantRecords({award, goal})
    const totalMinutes = _.sum(relevantRecords)
    return totalMinutes >= award.requirementValue
}

export const assessConsistencyAward = ({award, goal}: GoalAssessmentInput): boolean => {
    if (award.requirementUnit !== 'days') {
        return false
    }

    const relevantRecords = getRelevantRecords({award, goal})
    const totalDays = relevantRecords.filter((record) => record && record > 0).length
    return totalDays >= award.requirementValue
}