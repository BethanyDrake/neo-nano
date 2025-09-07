import { getSingle } from '@/lib/apiUtils/getSingle'
import { getUserIdFromSession } from '@/lib/apiUtils/getUserIdFromSession'
import { auth0 } from '@/lib/auth0'
import { Category, Comment, Thread, Topic } from '@/lib/forum.types'
import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

export type ReturnType = {
  comments: Comment[]
  thread: Thread
  category: Category
  topic: Topic
}


if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL)


export const GET = async function getThreadComments(req: NextRequest) {
  const threadId = req.nextUrl.searchParams.get('thread')
  const _comments = await sql`SELECT comment_text, author, comments.id, thread, display_name 
    FROM comments JOIN users on comments.author=users.id
  WHERE thread=${threadId}`

  const threadDetails =  await getSingle('thread', sql`SELECT title, author, id, topic FROM threads
  WHERE id=${threadId}`)

  const topic = await getSingle('topic', sql`SELECT id, title, description, icon, category FROM topics where id=${threadDetails.topic} LIMIT 1`)
  const category = await getSingle('category', sql`SELECT id, title FROM categories where id=${topic.category} LIMIT 1`)

  const comments = _comments.map(({comment_text, author, id, thread, display_name }) => ({
    text: comment_text,
    author,
    id,
     thread,
     authorDisplayName: display_name
  }))

  const response: ReturnType = {comments, thread: threadDetails as Thread, category: category as Category, topic: topic as Topic}

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
