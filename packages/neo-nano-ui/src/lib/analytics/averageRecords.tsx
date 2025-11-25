import { Record } from "@/lib/types/forum.types";
import { Matrix, matrix, multiply} from "mathjs"

const numberise = (userRecords: Record[][]): number[][] => {
    return userRecords.map((records) => records.map((entry) => entry ?? 0))

}

const sumColumns =(m: Matrix) => {
    return multiply(matrix([Array(m.size()[0]).fill(1)]), m)
}

export const averageRecords = (userRecords: Record[][]): Record[] => {
    const m = matrix(numberise(userRecords))
    const totalPerDay = sumColumns(m)
    const numDays = m.size()[0]
    return (totalPerDay.toArray()[0] as number[]).map((total) => total / numDays)
}