import { neon } from '@neondatabase/serverless'

const DB_TIMEOUT_MS = 10_000

export const getDbConnection = () => {
  if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
  const sql = neon(process.env.DATABASE_URL, {fetchOptions: { signal: AbortSignal.timeout(DB_TIMEOUT_MS) }})
  return sql
}
