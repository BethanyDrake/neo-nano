import { getQueryFunction } from '@/lib/apiUtils/getQueryFunction'
import { getThreadWithComments } from '@/lib/apiUtils/getThreadWithComments'
import { getUserIdFromSession } from '@/lib/apiUtils/getUserIdFromSession'
import { auth0 } from '@/lib/auth0'
import { Category, Comment, Thread, Topic } from '@/lib/forum.types'
import { NextRequest, NextResponse } from 'next/server'

export type ReturnType = {
  comments: Comment[]
  thread: Thread
  category: Category
  topic: Topic
}

const sql = getQueryFunction()

export async function GET(req: NextRequest) {
  const threadId = req.nextUrl.searchParams.get('thread') as string

  const response = await getThreadWithComments(threadId, getQueryFunction())

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
