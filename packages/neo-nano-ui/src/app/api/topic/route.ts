
import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL)

export const GET = async function getTopic(req: NextRequest) {
 
const id = req.nextUrl.searchParams.get('id')
   console.log("getting topic ", id)
  const _topics = await sql`SELECT * FROM topics where id=${id} LIMIT 1`


  if (_topics.length < 1) return NextResponse.json({error: 'topic not found'}, {status: 404})

   return NextResponse.json({ topic: _topics[0] })
}
