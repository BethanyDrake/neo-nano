'use client'
import { Dictionary } from 'lodash'
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CommentReactions, getThreadReactions } from '../serverFunctions/forum/getThreadReactions'

export const ReactionContext = createContext<{
  refresh: () => Promise<void>
  reactions: Dictionary<CommentReactions>
  initialLoad: boolean
}>({

  refresh: () => Promise.resolve(),
  reactions: {},
  initialLoad: false
})

export const ReactionContextProvider = ({ threadId, children }: PropsWithChildren & { threadId: string }) => {
  const [reactions, setReactions] = useState({})
  const [initialLoad, setInitialLoad] = useState(true)

  const refresh = useCallback(async () => {
    await getThreadReactions(threadId).then(setReactions)
  }, [threadId])

  useEffect(() => {
    refresh().then(() => setInitialLoad(false))
    
  }, [refresh])

  const value = useMemo(() => {
    return { reactions, refresh, initialLoad }
  }, [initialLoad, reactions, refresh])

  return <ReactionContext.Provider value={value}>{children}</ReactionContext.Provider>
}

export const useCommentLikes = (commentId: string) => {
  const { reactions, refresh , initialLoad} = useContext(ReactionContext)

  return {
    initialLoad,
    likes: reactions[commentId]?.like ?? [],
    refresh,
  }
}
