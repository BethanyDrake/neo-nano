'use client'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'
import { CommentCardDataEntry } from './CommentCard'
import { getThreadWithComments } from './serverFunctions/forum/getThreadWithComments'
import { addThreadComment } from './serverFunctions/forum/addThreadComment'
import { COMMENTS_PER_PAGE } from './misc'

export const ThreadContext = createContext<{
  updateCommentsData: () => Promise<void>
  commentsData: CommentCardDataEntry[]
  onPageChange: (n: number) => Promise<void>
  currentPage: number
  totalComments: number
  isLoading: boolean
  postComment: (plainText: string, richText: string) => Promise<void>
}>({
  updateCommentsData: () => Promise.resolve(),
  commentsData: [],
  onPageChange: () => Promise.resolve(),
  postComment: () => Promise.resolve(),
  currentPage: 0,
  totalComments: 0,
  isLoading: false
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
  const [isLoading, setIsLoading] = useState(false)

  const _update = useCallback(
    async (page: number) => {
      setIsLoading(true)
      const response = await getThreadWithComments(threadId, page)
      setComments(response.commentCardDataEntries)
      setTotalComments(response.totalComments)
      setIsLoading(false)
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

  const postComment = useCallback(async (plainText: string, richText: string) => {
    // add comment, then go to the last page
    setIsLoading(true)
    await addThreadComment(threadId, plainText, richText)
    const newLastPage = Math.ceil((totalComments + 1) / COMMENTS_PER_PAGE)
    onPageChange(newLastPage)
  }, [onPageChange, threadId, totalComments])


  const updateComments = useCallback(async () => {
    _update(currentPage)
  }, [_update, currentPage])

  const value = useMemo(() => {
    return { updateCommentsData: updateComments, commentsData: commentCards, currentPage, onPageChange, totalComments, isLoading, postComment }
  }, [commentCards, updateComments, onPageChange, currentPage, totalComments, isLoading, postComment])

  return <ThreadContext value={value}>{children}</ThreadContext>
}
