'use client'
import { Dictionary } from 'lodash'
import { createContext, PropsWithChildren,  useContext, useMemo } from 'react'
import { CommentReactions, getThreadReactions } from '../serverFunctions/forum/getThreadReactions'
import { useQuery } from '@tanstack/react-query'

export const ReactionContext = createContext<{
  refresh: () => Promise<unknown>
  reactions?: Dictionary<CommentReactions>
  initialLoad: boolean
}>({

  refresh: () => Promise.resolve(),
  reactions: {},
  initialLoad: false
})

export const ReactionContextProvider = ({ threadId, children }: PropsWithChildren & { threadId: string }) => {
  const {data: reactions, refetch, isLoading} = useQuery({queryKey: ['thread-reactions', threadId], queryFn: () => getThreadReactions(threadId)},)

  const value = useMemo(() => {
    return { reactions, refresh: refetch, initialLoad: isLoading }
  }, [isLoading, reactions, refetch])

  return <ReactionContext.Provider value={value}>{children}</ReactionContext.Provider>
}

export const useCommentLikes = (commentId: string) => {
  const { reactions, refresh , initialLoad} = useContext(ReactionContext)

  return {
    initialLoad,
    likes: reactions ? reactions[commentId]?.like ?? [] : [],
    refresh,
  }
}
