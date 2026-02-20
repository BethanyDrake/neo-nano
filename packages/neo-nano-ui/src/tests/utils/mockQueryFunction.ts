import { vi , Mock} from "vitest"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const mockQueryFunction = (
  mockGetQueryFunction: Mock,
  tableRows: Record<string, unknown[]>,
  matcherResults: Record<string, unknown> = {}
) => {


  const sql = vi.fn().mockImplementation((query: string) => {

    const matcherResult = Object.keys(matcherResults).find((matcher: string) => {
      const regex = new RegExp(matcher, 'gi')
      return regex.exec(query)
    })
    if (matcherResult) return Promise.resolve(matcherResults[matcherResult])

    if (/INSERT INTO/gi.exec(query) || /UPDATE TABLE/.exec(query)) return Promise.resolve([{}])
    const table = Object.keys(tableRows).find((tableName: string) => {
      const regex = new RegExp(`FROM ${tableName}`, 'gi')
      return regex.exec(query)
    })
    if (table) {
       return Promise.resolve(tableRows[table])
    }


    throw Error(`Unexpected query:${query}`)
  })

  mockGetQueryFunction.mockReturnValue(sql)
}
