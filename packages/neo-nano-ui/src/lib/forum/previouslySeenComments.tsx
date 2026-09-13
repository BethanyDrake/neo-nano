'use client'

import { useEffect, useState } from 'react'

const PREVIOUSLY_SEEN_THREAD_COMMENTS = `previously-seen-thread-comments`
const PREVIOUSLY_SEEN_TOPIC_THREADS = 'previously-seen-topic-threads'

const getLocalStorageObject = (key: string) => {
  const s = window.localStorage.getItem(key)
  const o = s ? JSON.parse(s) : {}
  return o
}

const setLocalStorageObject = (key: string, object: Record<string, unknown>) => {
  window.localStorage.setItem(key, JSON.stringify(object))
}

export const setPreviouslySeenThreadComments = (threadId: string, numberOfComments: number) => {
  setLocalStorageObject(PREVIOUSLY_SEEN_THREAD_COMMENTS, {
    ...getLocalStorageObject(PREVIOUSLY_SEEN_THREAD_COMMENTS),
    [threadId]: numberOfComments,
  })
}

export const usePreviouslySeenThreadComments = (threadId: string) => {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const n = getLocalStorageObject(PREVIOUSLY_SEEN_THREAD_COMMENTS)[threadId] ?? 0
    Promise.resolve().then(() => setValue(n))
  }, [threadId])

  return value
}

export const setPreviouslySeenTopicThreads = (topicId: string, threads: number, comments: number) => {
  setLocalStorageObject(PREVIOUSLY_SEEN_TOPIC_THREADS, {
    ...getLocalStorageObject(PREVIOUSLY_SEEN_TOPIC_THREADS),
    [topicId]: {threads, comments},
  })
}

export const usePreviouslySeenTopicThreads = (topicId: string): {threads: number, comments: number} => {
  const [value, setValue] = useState({threads: 0, comments: 0})
  useEffect(() => {
    const n = getLocalStorageObject(PREVIOUSLY_SEEN_TOPIC_THREADS)[topicId] ?? {threads: 0, comments: 0}
    Promise.resolve().then(() => setValue(n))
  }, [topicId])

  return value
}
