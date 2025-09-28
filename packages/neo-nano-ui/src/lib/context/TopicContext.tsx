'use client'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'
import { createThread as _createThread, CreateThreadPayload } from '../serverFunctions/forum/createThread'
import { getThreads, ThreadSummary } from '../serverFunctions/forum/getThreads'

export const TopicContext = createContext<{
  updateThreadsData: () => Promise<void>
  threadsData: ThreadSummary[]
  onPageChange: (n: number) => Promise<void>
  currentPage: number
  totalThreads: number
  isLoading: boolean
  topicId: string
  createThread: (payload: Omit<CreateThreadPayload, 'topic'>) => Promise<void>
}>({
  updateThreadsData: () => Promise.resolve(),
  threadsData: [],
  onPageChange: () => Promise.resolve(),
  createThread: () => Promise.resolve(),
  currentPage: 0,
  totalThreads: 0,
  isLoading: false,
  topicId: ''
})

export const useTopicContext = () => useContext(TopicContext)

export const TopicContextProvider = ({
  initialThreads,
  children,
  initialTotalThreads,
  topicId
}: PropsWithChildren & { topicId: string, initialTotalThreads: number; initialThreads: ThreadSummary[]}) => {
  const [totalThreads, setTotalThreads] = useState(initialTotalThreads)
  const [threadsData, setThreadsData] = useState<ThreadSummary[]>(initialThreads)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const _update = useCallback(
    async (page: number) => {
      setIsLoading(true)
      const response = await getThreads(topicId, page)
      setThreadsData(response.threadSummaries)
      setTotalThreads(response.totalThreads)
      setIsLoading(false)
    },
    [topicId],
  )
  const onPageChange = useCallback(
    async (page: number) => {
      setCurrentPage(page)
      _update(page)
    },
    [_update],
  )

  const createThread = useCallback(async (payload: Omit<CreateThreadPayload, 'topic'>) => {
    // add comment, then go to first page
    setIsLoading(true)
    await _createThread({
      ...payload,
      topic: topicId
    })
    onPageChange(1)
  }, [onPageChange, topicId])


  const updateThreadsData = useCallback(async () => {
    _update(currentPage)
  }, [_update, currentPage])

  const value = useMemo(() => {
    return {topicId, updateThreadsData, threadsData, currentPage, onPageChange, totalThreads, isLoading, createThread }
  }, [createThread, currentPage, isLoading, onPageChange, threadsData, topicId, totalThreads, updateThreadsData])

  return <TopicContext value={value}>{children}</TopicContext>
}
