import { Goal } from "@/lib/forum.types"
import { Award } from "@/lib/profile.types"
import { differenceInCalendarDays } from "date-fns"
import _ from 'lodash'


export type WordCountAwardAssessmentInput = {
    award: Pick<Award, 'startDate' | 'endDate' | 'requirementUnit' | 'requirementValue'>,
    goal: Pick<Goal,  'startDate' | 'lengthDays' | 'records'>
}

const dateToChallengeDay = (goalStartDate: string, date: string) => {
    return differenceInCalendarDays( new Date(date), new Date(goalStartDate),)
}

export const assessWordCountAward = ({award, goal}: WordCountAwardAssessmentInput): boolean => {
    if (award.requirementUnit !== 'words') {
        return false
    }

    const startChallengeDay = Math.max(dateToChallengeDay(goal.startDate, award.startDate), 0)
    const endChallengeDay = Math.min(dateToChallengeDay(goal.startDate, award.endDate) + 1, goal.lengthDays)

    const relevantRecords = goal.records.slice(startChallengeDay, endChallengeDay)
    const totalWords = _.sum(relevantRecords)
    return totalWords >= award.requirementValue


}