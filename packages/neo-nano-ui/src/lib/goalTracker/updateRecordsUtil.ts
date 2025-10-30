import { Goal } from "../forum.types"
import { changeAtIndex } from "./recordUtils"
import _ from 'lodash'

export const updateRecordsUtil = (challengeDay: number, newValue: number, records: Goal['records'], isCumulative: boolean) => {  
  
  let newRecords
      if (isCumulative) {
        const difference = newValue - _.sum(records.slice(0, challengeDay))
        newRecords = changeAtIndex(records, challengeDay, difference)
      } else {
        newRecords = changeAtIndex(records, challengeDay, newValue)
      }
      return newRecords
    }