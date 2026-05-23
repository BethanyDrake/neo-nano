'use client'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'
import { createThread as _createThread, CreateThreadPayload } from '../serverFunctions/forum/createThread'
import { getThreads, ThreadSummary } from '../serverFunctions/forum/getThreads'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export const TopicContext = createContext<{
  threadsData: ThreadSummary[]
  onPageChange: (n: number) => void
  currentPage: number
  totalThreads: number
  isLoading: boolean
  topicId: string
  createThread: (payload: Omit<CreateThreadPayload, 'topic'>) => Promise<void>
}>({
  threadsData: [],
  onPageChange: () => {},
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
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  const {data, isLoading } = useQuery({
    queryKey: ['topic-threads', topicId, currentPage],
    queryFn: () => getThreads(topicId, currentPage),
    placeholderData: {
      threadSummaries: initialThreads,
      totalThreads: initialTotalThreads
    }
  })

  const createThread = useCallback(async (payload: Omit<CreateThreadPayload, 'topic'>) => {
    await _createThread({
      ...payload,
      topic: topicId
    })
    queryClient.invalidateQueries({queryKey: ['topic-threads', topicId]})
    setCurrentPage(1)

  }, [topicId, queryClient])

  const value = useMemo(() => {
    return {
      topicId,
       threadsData: data?.threadSummaries ?? [],
       currentPage, 
       onPageChange: setCurrentPage, 
       totalThreads: data?.totalThreads ?? 0,
       isLoading, 
       createThread 
      }
  }, [createThread, currentPage, isLoading, data, topicId])

  return <TopicContext value={value}>{children}</TopicContext>
}
