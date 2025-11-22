import { Record } from "../forum.types";
import {  matrix, sort, transpose} from "mathjs"

const numberise = (userRecords: Record[][]): number[][] => {
    return userRecords.map((records) => records.map((entry) => entry ?? 0))

}


const arrayPercentile =(a:number[], percentile: number) => {
    const b = sort(a, 'asc')
    console.log(b)
    console.log((b.length * percentile) / (100))
    const index = Math.ceil((b.length * percentile) / (100)) - 1
    
    return b[index]

}
/**
 * 
 * @param percentile number 0-100
 */
export const percentilePerDay = (userRecords: Record[][], percentile: number): Record[] => {
    const m = matrix(numberise(userRecords))
    const recordsByDay = transpose(m).toArray() as number[][]

    return recordsByDay.map((day) => arrayPercentile(day, percentile))
}