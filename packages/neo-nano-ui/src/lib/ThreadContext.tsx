'use client'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'
import { CommentCardDataEntry } from './CommentCard'
import { getThreadWithComments } from './serverFunctions/forum/getThreadWithComments'

export const ThreadContext = createContext<{
  updateCommentsData: () => Promise<void>
  commentsData: CommentCardDataEntry[]
  onPageChange: (n: number) => Promise<void>
  currentPage: number
  totalComments: number
}>({
  updateCommentsData: () => Promise.resolve(),
  commentsData: [],
  onPageChange: () => Promise.resolve(),
  currentPage: 0,
  totalComments: 0
})

export const useThreadContext = () => useContext(ThreadContext)

export const ThreadContextProvider = ({
  initialComments,
  children,
  threadId,
  initialTotalComments,
}: PropsWithChildren & { initialTotalComments: number; initialComments: CommentCardDataEntry[]; threadId: string }) => {
  const [totalComments, setTotalComments] = useState(initialTotalComments)
  const [commentCards, setComments] = useState<CommentCardDataEntry[]>(initialComments)
  const [currentPage, setCurrentPage] = useState(1)

  const _update = useCallback(
    async (page: number) => {
      const response = await getThreadWithComments(threadId, page)
      setComments(response.commentCardDataEntries)
      setTotalComments(response.totalComments)
    },
    [threadId],
  )
  const onPageChange = useCallback(
    async (page: number) => {
      setCurrentPage(page)
      _update(page)
    },
    [_update],
  )
  const updateComments = useCallback(async () => {
    _update(currentPage)
  }, [_update, currentPage])

  const value = useMemo(() => {
    return { updateCommentsData: updateComments, commentsData: commentCards, currentPage, onPageChange, totalComments }
  }, [commentCards, updateComments, onPageChange, currentPage, totalComments])

  return <ThreadContext value={value}>{children}</ThreadContext>
}
