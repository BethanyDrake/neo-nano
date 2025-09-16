import { neon } from '@neondatabase/serverless'

export const getDbConnection = () => {
  if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
  const sql = neon(process.env.DATABASE_URL)
  return sql
}
