/* eslint-disable @typescript-eslint/no-explicit-any */
export const mockQueryFunction = (
  mockGetQueryFunction: jest.Mock<any, any, any>,
  tableRows: Record<string, unknown[]>,
) => {
  const sql = jest.fn().mockImplementation((query: string) => {
    const table = Object.keys(tableRows).find((tableName: string) => {
      const regex = new RegExp(`FROM ${tableName}`, 'gi')
      return regex.exec(query)
    })
    if (!table) {
      throw Error(`Unexpected query:${query}`)
    }

    return Promise.resolve(tableRows[table])
  })

  mockGetQueryFunction.mockReturnValue(sql)
}
