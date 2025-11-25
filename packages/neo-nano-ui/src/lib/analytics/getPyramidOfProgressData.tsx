import { sum } from "lodash";
import { Record } from "@/lib/types/forum.types";

export type PyramidEntry = 
{
    milestone: number,
    writerCount: number
}

export const pyramidOfProgressData = (userRecords: Record[][], milestones: number[]): PyramidEntry[] => {

    const totals = userRecords.map((records) => sum(records))

    return milestones.map((milestone) => ({
        milestone,
        writerCount: totals.filter((total) => total >= milestone).length
    }))

  
}