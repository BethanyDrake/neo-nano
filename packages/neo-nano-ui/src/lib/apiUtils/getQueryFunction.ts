import { neon } from "@neondatabase/serverless"

export const getQueryFunction = () => {
    if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
    return neon(process.env.DATABASE_URL)
}