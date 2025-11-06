'use client'
import { Dictionary } from 'lodash'
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CommentReactions, getThreadReactions } from '../serverFunctions/forum/getThreadReactions'

export const ReactionContext = createContext<{
  refresh: () => Promise<void>
  reactions: Dictionary<CommentReactions>
}>({
  refresh: () => Promise.resolve(),
  reactions: {},
})

export const ReactionContextProvider = ({ threadId, children }: PropsWithChildren & { threadId: string }) => {
  const [reactions, setReactions] = useState({})

  const refresh = useCallback(async () => {
    await getThreadReactions(threadId).then(setReactions)
  }, [threadId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(() => {
    return { reactions, refresh }
  }, [reactions, refresh])

  return <ReactionContext.Provider value={value}>{children}</ReactionContext.Provider>
}

export const useCommentLikes = (commentId: string) => {
  const { reactions, refresh } = useContext(ReactionContext)

  return {
    likes: reactions[commentId]?.like ?? [],
    refresh,
  }
}
