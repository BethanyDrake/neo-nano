import { getUserIdFromSession } from '@/lib/apiUtils/getUserIdFromSession'
import { auth0 } from '@/lib/auth0'
import { Comment, Thread } from '@/lib/forum.types'
import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

export type ReturnType = {
  comments: Comment[]
  thread: Thread
}


if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL)

const getSingle = async <T>(name: string, sqlResponse: Promise<T[]>): Promise<T> => {
  const rows = await sqlResponse
  if (rows.length < 1 ) {
    throw Error(`${name} not found`)
  }
  return rows[0]


}

export const GET = async function getThreadComments(req: NextRequest) {
  const threadId = req.nextUrl.searchParams.get('thread')
  const _comments = await sql`SELECT comment_text, author, comments.id, thread, display_name 
    FROM comments JOIN users on comments.author=users.id
  WHERE thread=${threadId}`

  const threadDetails =  await getSingle('thread', sql`SELECT title, author, id FROM threads
  WHERE id=${threadId}`)

  const comments = _comments.map(({comment_text, author, id, thread, display_name }) => ({
    text: comment_text,
    author,
    id,
     thread,
     authorDisplayName: display_name
  }))

  const response: ReturnType = {comments, thread: threadDetails as Thread}

   return NextResponse.json(response)
}


export const POST = async function addThreadComment(req: NextRequest) {

const session = await auth0.getSession()

    const body = await req.json()
    const thread = body.thread
    const commentText = body.commentText

    const author = await getUserIdFromSession(session, sql)

    const res = await sql`INSERT INTO comments (comment_text, author, thread) 
      VALUES (${commentText}, ${author}, ${thread})
      RETURNING id`

    console.info(`Created comemnt: ${JSON.stringify(res)}`)

    return NextResponse.json({})
}
