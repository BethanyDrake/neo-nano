import type { NextRequest } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { neon } from '@neondatabase/serverless'
if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL)

export async function PUT(req: NextRequest,   { params }: { params: Promise<{ ['goal-id']: string }> }) {
  const id = (await params)['goal-id']

  const session = await auth0.getSession()
  const user_id = session?.user.sub
  const body = await req.json()

  await sql`UPDATE goals set records=${body.records}
       where user_id=${user_id}
       and id=${id}`

  return Response.json({})
}
