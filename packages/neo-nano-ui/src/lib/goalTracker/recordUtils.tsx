import { Record } from "@/lib/types/forum.types"

export const toCumulative = (perDay: Record[]) => {
  const cumulative: Array<number> = []
  perDay.forEach((record, i) => {
    if (i === 0) cumulative.push(record ?? 0)
    else cumulative.push((record ?? 0) + cumulative[i - 1])
  })

return cumulative.map((r) => (r === 0 ? null : r))
}

export const toPerDay = (cumulative: Record[]) => {
  const perDay: Record[] = []
  cumulative.forEach((record, i) => {
    if (i === 0) perDay.push(record)
    else perDay.push((record ?? 0) - (cumulative[i - 1] ?? 0))
  })

  return perDay.map((r) => (r === 0 ? null : r))
}

export const changeAtIndex = (array: Array<number|null>, index: number, newValue: number) => {
      const head = array.slice(0, index)
      const tail = array.slice(index + 1) 
      return [...head, newValue, ...tail]
}
