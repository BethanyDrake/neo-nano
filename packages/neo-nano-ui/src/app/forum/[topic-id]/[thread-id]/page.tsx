import { ThreadPage } from './ThreadPage'
import { getThreadWithComments } from '@/lib/serverFunctions/forum/getThreadWithComments'
import { ThreadContextProvider } from '@/lib/context/ThreadContext'
import { ReactionContextProvider } from '@/lib/context/ReactionContext'
import { UserContextProvider } from '@/lib/context/UserContext'

export default async function Page({ params }: { params: Promise<{ 'thread-id': string }> }) {
  const threadId = (await params)['thread-id'] as string

  const { thread, category, commentCardDataEntries, topic, totalComments } = await getThreadWithComments(threadId)

  return (
    <UserContextProvider>
      <ReactionContextProvider threadId={thread.id}>
        <ThreadContextProvider
          initialComments={commentCardDataEntries}
          initialTotalComments={totalComments}
          threadId={thread.id}
        >
          <ThreadPage thread={thread} topic={topic} category={category}/>
        </ThreadContextProvider>
      </ReactionContextProvider>
    </UserContextProvider>
  )
}
