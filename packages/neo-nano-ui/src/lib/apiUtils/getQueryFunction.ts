import { neon, types } from '@neondatabase/serverless'

export const getQueryFunction = () => {
  if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
  types.setTypeParser(1082, (value) => value)

  return neon(process.env.DATABASE_URL)
}
