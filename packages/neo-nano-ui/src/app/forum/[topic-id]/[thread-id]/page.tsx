import { ThreadPage } from './ThreadPage'
import { getThreadWithComments } from '@/lib/serverFunctions/forum/getThreadWithComments'
import { ThreadContextProvider } from '@/lib/context/ThreadContext'
import { ReactionContextProvider } from '@/lib/context/ReactionContext'

export default async function Page({ params }: { params: Promise<{ 'thread-id': string }> }) {
  const threadId = (await params)['thread-id'] as string

  const { thread, category, commentCardDataEntries, topic, totalComments, removalStatus } = await getThreadWithComments(threadId)

  return (
      <ReactionContextProvider threadId={thread.id}>
        <ThreadContextProvider
          initialComments={commentCardDataEntries}
          initialTotalComments={totalComments}
          threadId={thread.id}
          initialIsLocked={!!removalStatus}
        >
          <ThreadPage thread={thread} topic={topic} category={category}/>
        </ThreadContextProvider>
      </ReactionContextProvider>
  )
}
