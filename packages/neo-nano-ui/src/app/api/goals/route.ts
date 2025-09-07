import { getUserIdFromSession } from "@/lib/apiUtils/getUserIdFromSession"
import { auth0 } from "@/lib/auth0"
import { neon, NeonQueryFunction, types } from "@neondatabase/serverless"
import camelcaseKeys from "camelcase-keys"
import { NextResponse } from "next/server"
if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL)

types.setTypeParser(1082, (value) => value)

const _getMyGoals = async (user_id: string, sql:NeonQueryFunction<false, false>) => {
  const goals = await sql`SELECT id, title, target, start_date, length_days, records
    FROM goals
    WHERE user_id=${user_id}
    ORDER BY start_date DESC`
  return camelcaseKeys(goals)
}

export const POST = async function createGoals() {
  try {
    const session = await auth0.getSession()
    const title = "November 2025"
    const user_id = await getUserIdFromSession(session, sql)
    const target = 50000
    const length_days = 30
    const start_date = '2025-11-01'
    const records = new Array(30).fill(null)


    await sql`INSERT INTO goals (title, target, start_date, length_days, records, user_id) 
    VALUES (${title}, ${target}, ${start_date}, ${length_days}, ${records}, ${user_id})`

    const updatedGoals = await _getMyGoals(user_id, sql)

    return NextResponse.json({updatedGoals})
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}

export const GET = async function getMyGoals() {
  try {
    
    const session = await auth0.getSession()
    const user_id = await getUserIdFromSession(session, sql)
    const goals = await _getMyGoals(user_id, sql)


    return NextResponse.json({goals})
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
