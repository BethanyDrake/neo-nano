import { auth0 } from '@/lib/auth0'
import { ThreadPage } from './ThreadPage'
import { getThreadWithComments } from '@/lib/serverFunctions/forum/getThreadWithComments'

export default async function Page({ params }: { params: Promise<{ 'thread-id': string }> }) {
  const session = await auth0.getSession()
  const threadId = (await params)['thread-id'] as string

  const { thread, category, commentCardDataEntries, topic } = await getThreadWithComments(threadId)

  return <ThreadPage thread={thread} topic={topic} category={category} initialComments={commentCardDataEntries} isLoggedIn={!!session} />
}
