import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '../../../lib/auth0'
import { neon } from '@neondatabase/serverless'
import { Comment, Thread } from '@/lib/forum.types'
import { getUserIdFromSession } from '@/lib/apiUtils/getUserIdFromSession'
if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL)

export type ThreadSummary =  (Thread & Pick<Comment, 'text'>)
export type ReturnType = {
  threads: ThreadSummary[]
}

export const POST = async function createThread(req: NextRequest) {
  try {
    const session = await auth0.getSession()

    const body = await req.json()

    const title = body.title
    const topic = body.topic
    const commentText = body.commentText

    const userId = await getUserIdFromSession(session, sql)

    const res = await sql`INSERT INTO threads (title, author, topic) 
      VALUES (${title}, ${userId}, ${topic})
      RETURNING id`
      console.log('thread result', res)

    const createdThreadId = res[0].id

    await sql`INSERT INTO comments (comment_text, author, thread) 
      VALUES (${commentText}, ${userId}, ${createdThreadId})
      RETURNING id`

    console.info(`Created thread: ${res}`)

    return NextResponse.json({})
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}

export const GET = async function getThreads(req: NextRequest) {
  try {
    const topic = req.nextUrl.searchParams.get('topic')
    const _threads = await sql`
    SELECT * FROM threads, 
      LATERAL (SELECT comment_text FROM comments WHERE comments.thread=threads.id LIMIT 1)
    WHERE threads.topic=${topic}`

     console.log({_threads})

    const threads = _threads.map((_thread) => ({
      ..._thread,
      text: _thread.comment_text
    }))

    return NextResponse.json({ threads })
  } catch (error) {
    console.error('Error getting threads')
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
