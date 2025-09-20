export const getSingle = async <T>(name: string, sqlResponse: Promise<T[]>): Promise<T> => {
  const rows = await sqlResponse
  if (rows.length < 1 ) {
    throw Error(`${name} not found`)
  }
  return rows[0]
}