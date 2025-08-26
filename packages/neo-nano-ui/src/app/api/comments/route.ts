import { auth0 } from '@/lib/auth0'
import { Comment } from '@/lib/forum.types'
import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

export type ReturnType = {
  comments: Comment[]
}


if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL)

export const GET = async function getThreadComments(req: NextRequest) {

  console.log("getThread comments")
  const thread = req.nextUrl.searchParams.get('thread')
  console.log({thread})
  const _comments = await sql`SELECT comment_text, author, id, thread FROM comments
  WHERE thread=${thread}`

  console.log({_comments})

  const comments = _comments.map(({comment_text, author, id, thread }) => ({
    text: comment_text,
    author,
    id,
     thread
  }))

  const response: ReturnType = {comments}

   return NextResponse.json(response)
}


export const POST = async function addThreadComment(req: NextRequest) {

const session = await auth0.getSession()

    const body = await req.json()
    const thread = body.thread
    const commentText = body.commentText
    const author = session?.user.sub

    await sql`INSERT INTO users (id, display_name) 
      VALUES (${author}, ${session?.user.nickname})
      ON CONFLICT (id) DO NOTHING`

    const res = await sql`INSERT INTO comments (comment_text, author, thread) 
      VALUES (${commentText}, ${author}, ${thread})
      RETURNING id`

    console.info(`Created comemnt: ${JSON.stringify(res)}`)

    return NextResponse.json({})
}
