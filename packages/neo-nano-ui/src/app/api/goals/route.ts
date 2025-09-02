import { auth0 } from "@/lib/auth0"
import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL)

export const POST = async function createGoals() {
  try {
    const session = await auth0.getSession()
    console.log("createGoals", session)
    const title = "November 2025"
    const user_id = session?.user.sub
    const target = 50000
    const length_days = 30
    const start_date = '2025-11-01'
    const records = new Array(30).fill(null)


    await sql`INSERT INTO goals (title, target, start_date, length_days, records, user_id) 
    VALUES (${title}, ${target}, ${start_date}, ${length_days}, ${records}, ${user_id}) RETURNING id`


    return NextResponse.json({})
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}

export const GET = async function getMyGoals() {
  try {
    
    const session = await auth0.getSession()
    const user_id = session?.user.sub
    console.log("getGoals", session)
    const goals = await sql`SELECT id, title, target, start_date, length_days, records
    FROM goals
    WHERE user_id=${user_id}`


    return NextResponse.json({goals})
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
