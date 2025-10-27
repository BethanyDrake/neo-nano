import { Goal } from "@/lib/forum.types"
import { Award } from "@/lib/profile.types"
import { differenceInCalendarDays } from "date-fns"
import _ from 'lodash'


export type GoalAssessmentInput = {
    award: Pick<Award, 'startDate' | 'endDate' | 'requirementUnit' | 'requirementValue'>,
    goal: Pick<Goal,  'startDate' | 'lengthDays' | 'records'>
}

const dateToChallengeDay = (goalStartDate: string, date: string) => {
    return differenceInCalendarDays( new Date(date), new Date(goalStartDate),)
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

export const assessConsistencyAward = ({award, goal}: GoalAssessmentInput): boolean => {
    if (award.requirementUnit !== 'days') {
        return false
    }

    const relevantRecords = getRelevantRecords({award, goal})
    const totalDays = relevantRecords.filter((record) => record && record > 0).length
    return totalDays >= award.requirementValue
}