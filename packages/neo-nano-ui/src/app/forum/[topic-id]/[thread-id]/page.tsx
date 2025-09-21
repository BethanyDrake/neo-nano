import { auth0 } from '@/lib/auth0'
import { ThreadPage } from './ThreadPage'
import { getThreadWithComments } from '@/lib/serverFunctions/forum/getThreadWithComments'
import { ThreadContextProvider } from '@/lib/ThreadContext'

export default async function Page({ params }: { params: Promise<{ 'thread-id': string }> }) {
  const session = await auth0.getSession()
  const threadId = (await params)['thread-id'] as string

  const { thread, category, commentCardDataEntries, topic } = await getThreadWithComments(threadId)

  return  <ThreadContextProvider initialComments={commentCardDataEntries} threadId={thread.id}><ThreadPage thread={thread} topic={topic} category={category} isLoggedIn={!!session} /></ThreadContextProvider>
}
