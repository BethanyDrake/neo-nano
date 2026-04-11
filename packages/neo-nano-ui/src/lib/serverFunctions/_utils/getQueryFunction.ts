import { neon, types } from '@neondatabase/serverless'
console.log(process.env.NODE_ENV )

export const getQueryFunction = () => {
  if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
  types.setTypeParser(1082, (value) => value)

  return neon(process.env.DATABASE_URL, {disableWarningInBrowsers: process.env.NODE_ENV==='test'})
}
