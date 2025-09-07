
import { getSingle } from '@/lib/apiUtils/getSingle'
import { Category, Topic } from '@/lib/forum.types'
import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL)

export type GetTopicReturn  = {
   topic: Topic,
   category: Category
}


export const GET = async function getTopic(req: NextRequest) {
 
const id = req.nextUrl.searchParams.get('id')
   console.log("getting topic ", id)

  const topic = await getSingle('topic', sql`SELECT id, title, description, icon, category FROM topics where id=${id} LIMIT 1`)
   const category = await getSingle('category', sql`SELECT id, title FROM categories where id=${topic.category} LIMIT 1`)

   return NextResponse.json({ topic, category })
}
